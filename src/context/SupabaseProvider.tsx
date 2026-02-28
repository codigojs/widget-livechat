import React, { useState, useEffect, useRef } from "react";
import type { RealtimeChannel } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";

import { useSupabaseClient } from "../hooks/useSupabaseClient";
import { useWidgetContext } from "../hooks/useWidgetContext";
import { useMessageProcessor } from "../hooks/useMessageProcessor";
import { useSession } from "../hooks/useSessionChat";
import { SupabaseContext } from "./SupabaseContext";
import { chatLiveService } from "../services/chatSercices";
import { isAgentActive } from "../services/agentServices";
import type { Message, SupabaseMessage, PresenceState } from "../types/types";

interface SupabaseProviderProps {
  children: React.ReactNode;
  enabled: boolean;
}

const MAX_MESSAGE_LENGTH = 500; // Máximo de caracteres permitidos
const MIN_TIME_BETWEEN_MESSAGES_MS = 2000; // 2 segundos entre envíos

// Rate limit monitoring (silent, logs only on errors)
const RATE_LIMIT_WINDOW_MS = 1000;
const RATE_LIMIT_THRESHOLD = 10;

export const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [readyState, setReadyState] = useState(false);
  const [lastSentAt, setLastSentAt] = useState<number>(0);
  const [channelChat, setChannelChat] = useState<RealtimeChannel | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isTypingHuman, setIsTypingHuman] = useState(false);
  const [awaitingName, setAwaitingName] = useState(false);
  const [pendingMessages, setPendingMessages] = useState<number>(0);
  const [isHumanSessionActive, setIsHumanSessionActive] = useState(false);

  // Ref para rastrear cuántas respuestas de IA esperamos
  // Incrementa cada vez que enviamos un mensaje esperando respuesta
  // Decrementa cada vez que llega una respuesta del asistente
  const pendingResponsesRef = useRef(0);

  // Rate limit tracking - movido de module-level a component ref
  const trackCallTimestamps = useRef<number[]>([]);

  const { closeSession } = useSession();

  const supabase = useSupabaseClient();
  const { config, setConfig } = useWidgetContext();
  const { formatMessage } = useMessageProcessor();

  /**
   * Manejamos el estado de sincronización de presencia
   * @param channel - Canal de realtime
   * @returns
   */
  const handlePresenceSync = (channel: RealtimeChannel) => {
    const presence = channel.presenceState();
    setReadyState(true);
    if (!presence) return;

    // Obtenemos la primera clave que empieza con agent:
    const agentKey = Object.keys(presence).find((key) =>
      key.startsWith("agent:")
    );
    if (!agentKey) return;

    const states = presence[agentKey] as PresenceState[] | undefined;

    const newTypingState = states ? states.some((s) => s.typing) : false;
    const newOnlineState = states ? states.some((s) => s.online) : false;
    setIsTypingHuman(newTypingState);
    setReadyState(newOnlineState);
  };

  /**
   * Manejamos el estado de unión a la sala
   * @returns
   */
  const handlePresenceJoin = () => {
    setReadyState(true);
    setIsTypingHuman(false);
  };

  /**
   * Manejamos el estado de salida de la sala
   * @returns
   */
  const handlePresenceLeave = () => {
    setReadyState(false);
  };

  /**
   * Unimos el chat con el asistente IA
   * @param sessionId - ID de la sesión
   * @returns
   */
  const joinChatAssistant = async (sessionId: string) => {
    if (channelChat || !supabase) return;

    const channelName = `chat:${sessionId}`;
    const channel = supabase.channel(channelName, {
      config: { presence: { key: `user:${sessionId}` } },
    });

    channel
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          const newMessage = payload.new as SupabaseMessage;
          setMessages((prev) => [...prev, formatMessage(newMessage)]);

          // Decrementar el contador de respuestas esperadas cuando llega un mensaje del asistente
          // Solo si estamos esperando una respuesta (pendingResponsesRef.current > 0)
          if (newMessage.role === "assistant" && pendingResponsesRef.current > 0) {
            pendingResponsesRef.current -= 1;

            // Decrementar el contador de mensajes pendientes
            setPendingMessages((prev) => Math.max(0, prev - 1));

            // Solo desactivar el loading cuando todas las respuestas esperadas han llegado
            if (pendingResponsesRef.current === 0) {
              setIsLoadingMessages(false);
            }
          }
        }
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "human_sessions",
          filter: `session_id=eq.${sessionId}`,
        },
        (payload) => {
          // Actualizar estado cuando cambia el status de human_sessions
          if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
            const newStatus = (payload.new as { status?: string })?.status;

            // Si el status cambió a 'closed', mostrar mensaje y cerrar
            if (newStatus === "closed") {
              setIsHumanSessionActive(false);

              // Mostrar mensaje de despedida
              setMessages((prev) => [
                ...prev,
                formatMessage({
                  role: "assistant",
                  content: "El agente ha finalizado la conversación. ¡Gracias por contactarnos!",
                  agent_id: config?.agent_id || "",
                  session_id: config?.session_id || "",
                  created_at: new Date().toISOString(),
                  id: "",
                }),
              ]);

              // Delay de 2 segundos para que el usuario lea el mensaje
              setTimeout(() => {
                void closeChat().then(() => {
                  closeSession();
                  if (config) {
                    setConfig({ ...config, session_id: '' });
                  }
                });
              }, 2000);

            } else {
              // Para otros estados (active, etc.)
              setIsHumanSessionActive(newStatus === "active");
            }
          } else if (payload.eventType === "DELETE") {
            setIsHumanSessionActive(false);

            // Si se elimina el registro, también cerrar con mensaje
            setMessages((prev) => [
              ...prev,
              formatMessage({
                role: "assistant",
                content: "La conversación ha finalizado. ¡Gracias por contactarnos!",
                agent_id: config?.agent_id || "",
                session_id: config?.session_id || "",
                created_at: new Date().toISOString(),
                id: "",
              }),
            ]);

            setTimeout(() => {
              void closeChat().then(() => {
                closeSession();
                if (config) {
                  setConfig({ ...config, session_id: '' });
                }
              });
            }, 2000);
          }
        }
      )
      .on("presence", { event: "sync" }, () => {
        handlePresenceSync(channel);
      })
      .on("presence", { event: "join" }, () => {
        handlePresenceJoin();
      })
      .on("presence", { event: "leave" }, () => {
        handlePresenceLeave();
      })
      .subscribe((_status, err) => {
        // Solo log de errores críticos
        if (err) {
          console.error("Realtime error:", err);

          // Detectar rate limit
          if (err.message?.includes("rate_limit") ||
              err.message?.includes("ClientPresenceRateLimitReached")) {
            console.error("🚨 Realtime rate limit error detected");
          }
        }
      });

    // Set Online User
    trackCallTimestamps.current.push(Date.now());

    channel.track({
      online: true,
      typing: false,
      online_at: new Date().toISOString(),
    });

    channel.on("broadcast", { event: "agent_info" }, (payload) => {
      if (config) {
        setConfig({
          ...config,
          title: payload.payload.name,
          avatar_url: payload.payload.avatar,
        });
      }
    });
    setChannelChat(channel);

    // El agente finaliza el chat
    channel.on("broadcast", { event: "chat_closed" }, async (payload: { payload: { message: string, user_name: string } } ) => {
      // 0. Detener loading si está activo
      setIsLoadingMessages(false);

      // 1. Agregar mensaje del agente al chat
      setMessages((prev) => [
        ...prev,
        formatMessage({
          role: "human",
          content: payload.payload.message,
          agent_id: config?.agent_id || "",
          session_id: config?.session_id || "",
          created_at: new Date().toISOString(),
          id: "",
        }),
      ]);

      // 2. Cerrar canal de forma limpia (hace untrack + removeChannel)
      await closeChat();

      // 3. Cerrar sesión (limpia cookies y localStorage)
      closeSession();

      // 4. Resetear session_id para permitir nuevo chat
      // Nota: El nombre del agente se actualiza cuando se recibe 'agent_info'
      // en el próximo chat
      if (config) {
        setConfig({
          ...config,
          session_id: '', // Limpiar session_id para forzar crear nueva sesión
        });
      }

      // 5. Limpiar estado del canal
      setChannelChat(null);

      // 6. Desactivar estado de listo para permitir reinicialización
      setReadyState(false);
    });
  };

  /**
   * Indicador de escritura
   * @param typing
   *
   * IMPORTANTE:
   * - track() REEMPLAZA el estado completo, no lo actualiza parcialmente.
   * - Solo enviamos typing status cuando hay human session activa
   * - Durante conversación con bot, typing no tiene propósito funcional
   * Portado de: frontend/src/stores/presenceChatStore.ts (línea 310)
   */
  const setTypingStatus = (typing: boolean) => {
    // Solo enviar typing status si hay human session activa
    // El bot no necesita saber si el usuario está escribiendo
    if (channelChat && isHumanSessionActive) {
      // Monitorear rate limit silenciosamente
      const now = Date.now();
      trackCallTimestamps.current.push(now);

      trackCallTimestamps.current = trackCallTimestamps.current.filter(
        (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS
      );

      const currentRate = trackCallTimestamps.current.length;

      // Solo log si superamos el límite (indicador de problema)
      if (currentRate > RATE_LIMIT_THRESHOLD) {
        console.error(
          `🚨 Realtime rate limit exceeded: ${currentRate}/${RATE_LIMIT_THRESHOLD} calls/sec`
        );
      }

      channelChat.track({
        typing,
        online: true,
        online_at: new Date().toISOString(),
      });
      setIsTyping(typing);
    }
  };

  /**
   * Cerramos la sesión del chat
   * Hace cleanup apropiado para disparar el evento 'leave' correctamente
   */
  const closeChat = async () => {
    if (channelChat && supabase) {
      try {
        // 1. Actualizar presencia a offline antes de hacer untrack
        await channelChat.track({
          online: false,
          typing: false,
          online_at: new Date().toISOString(),
        });

        // 2. Pequeño delay para que se propague el cambio
        await new Promise(resolve => setTimeout(resolve, 100));

        // 3. Hacer untrack explícito para disparar el evento 'leave'
        await channelChat.untrack();

        // 4. Remover el canal
        supabase.removeChannel(channelChat);
      } catch (error) {
        console.error('Error closing chat:', error);
        // Asegurar que se cierre el canal incluso si hay error
        supabase.removeChannel(channelChat);
      }
    }
    // Limpiar tracking de rate limit
    trackCallTimestamps.current = [];
    setReadyState(false);
  };

  /**
   * Refrescar la sesión del chat
   * Limpia todos los mensajes, genera un nuevo session_id y reinicia el chat
   */
  const refreshSession = async () => {
    // 1. Cerrar la sesión actual completamente
    if (channelChat && supabase) {
      try {
        await channelChat.track({
          online: false,
          typing: false,
          online_at: new Date().toISOString(),
        });
        await new Promise(resolve => setTimeout(resolve, 100));
        await channelChat.untrack();
        supabase.removeChannel(channelChat);
      } catch (error) {
        console.error('Error closing channel in refresh:', error);
        try {
          supabase.removeChannel(channelChat);
        } catch {
          // Ignorar error si ya está cerrado
        }
      }
    }

    // 2. Limpiar los mensajes
    setMessages([]);

    // 3. Resetear todo el estado
    setReadyState(false);
    setIsLoadingMessages(false);
    setIsTyping(false);
    setIsTypingHuman(false);
    setAwaitingName(false);
    setPendingMessages(0);
    pendingResponsesRef.current = 0;
    setChannelChat(null);
    setLastSentAt(0);
    setIsHumanSessionActive(false);

    // Limpiar tracking de rate limit
    trackCallTimestamps.current = [];

    // 4. Cerrar la sesión de cookies (elimina travelbot_session_id del localStorage)
    await closeSession();

    // 5. Pequeño delay para asegurar que todo se limpie
    await new Promise(resolve => setTimeout(resolve, 200));

    // 6. Generar un nuevo session_id (esto dispara el useEffect para iniciar nueva sesión)
    if (config) {
      const newSessionId = uuidv4();
      setConfig({
        ...config,
        session_id: newSessionId,
      });
    }
  };

  /**
   * Enviamos el mensaje al servidor
   * @param content
   * @returns
   */
  const sendMessage = async (content: string) => {
    if (!config?.agent_id || !config?.session_id) {
      return;
    }

    // --- Validaciones de seguridad en el cliente ---
    const now = Date.now();
    if (now - lastSentAt < MIN_TIME_BETWEEN_MESSAGES_MS) {
      setIsLoadingMessages(true);
      return;
    }
    if (content.trim() === "") {
      setIsLoadingMessages(true);
      return;
    }
    if (content.length > MAX_MESSAGE_LENGTH) {
      alert(
        `El mensaje es demasiado largo. Máximo ${MAX_MESSAGE_LENGTH} caracteres.`
      );
      setIsLoadingMessages(true);
      return;
    }

    // Comprobamos si estamos esperando el nombre del usuario.
    // TODO: Buscar una mejor forma de hacerlo en el futuro
    // cuando se implementen más opciones al chat
    if (awaitingName) {
      if (!supabase) return;

      const isValidName = /^[a-zA-ZÀ-ÿ\s]{3,40}$/.test(content.trim());
      const hasOneWords = content.trim().split(" ").length >= 1;

      if (isValidName && hasOneWords) {
        setAwaitingName(false);
        setIsLoadingMessages(false);

        // Guardar el nombre
        await supabase
          .from("human_sessions")
          .update({ user_name: content.trim() })
          .eq("session_id", config.session_id)
          .select();

        // Confirmar al usuario y unirlo al chat
        setMessages((prev) => [
          ...prev,
          formatMessage({
            role: "assistant",
            content: `¡Gracias ${content.trim()}! ¿En que te puedo ayudar?`,
            agent_id: config.agent_id || "",
            session_id: config.session_id || "",
            created_at: new Date().toISOString(),
            id: "",
          }),
        ]);
      } else {
        setIsLoadingMessages(false);
        setMessages((prev) => [
          ...prev,
          formatMessage({
            role: "assistant",
            content:
              "<p>Por favor, indícame nombre y apellido. Ejemplo: <b>Carlos Gómez</b></p>",
            agent_id: config.agent_id || "",
            session_id: config.session_id || "",
            created_at: new Date().toISOString(),
            id: "",
          }),
        ]);
      }
      return;
    }

    setLastSentAt(now);

    // Incrementar contador de mensajes pendientes antes de enviar
    // porque los mensajes de usuario/consentimiento pueden llegar 
    // por websocket antes que la respuesta de la API
    setPendingMessages((prev) => prev + 1);

    try {
      const response = await chatLiveService(
        content,
        config.agent_id,
        config.session_id
      );

      // Verificar si hay sesión humana activa en la respuesta
      const isHumanSessionActive = response.metadata?.human_session_active === true;

      if (isHumanSessionActive) {
        // Activar typing status para human sessions
        setIsHumanSessionActive(true);

        // Si hay respuesta del agente, procesarla normalmente
        if (!response.response) {
          // Sin respuesta del agente (mensaje ya guardado en DB por transfer tool)
          setIsLoadingMessages(false);
          setPendingMessages((prev) => Math.max(0, prev - 1));
        }
      } else if (response.response) {
        // Tenemos respuesta del agente IA
        pendingResponsesRef.current += 1;
        setIsLoadingMessages(true);
      } else {
        // Sin respuesta ni transfer
        setIsLoadingMessages(false);
        setPendingMessages((prev) => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error(
        "Error enviando mensaje:",
        error instanceof Error ? error.message : error
      );
      setIsLoadingMessages(false);
      // En error, decrementar el contador que se incrementó antes de enviar
      setPendingMessages((prev) => Math.max(0, prev - 1));
    }
  };

  /**
   * Desuscribimos del canal de mensajes
   */
  const unsubscribeChannel = () => {
    if (channelChat && supabase) {
      supabase.removeChannel(channelChat);
      setChannelChat(null);
    }
    setReadyState(false);
  };

  useEffect(() => {
    if (!config?.agent_id || !supabase) return;

    const load = async () => {
      if (config.session_id) {
        // 1. Verificar si hay human session activa (para restaurar estado en page reload)
        const { data: activeSession } = await supabase
          .from('human_sessions')
          .select('*')
          .eq('session_id', config.session_id)
          .eq('status', 'active')
          .maybeSingle();

        setIsHumanSessionActive(!!activeSession);

        // 2. Comprobamos si el agente está activo o tiene permisos para enviar mensajes
        const agentData = await isAgentActive(config.agent_id, config.session_id);

        if (!agentData) {
          setReadyState(false);
          return;
        }

        // 3. Unir al chat assistant
        joinChatAssistant(config.session_id);
      }
    };
    load();

    return () => {
      unsubscribeChannel();
      // No await en cleanup - se ejecuta de forma asíncrona
      void closeChat();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.agent_id, config?.session_id]);

  return (
    <SupabaseContext.Provider
      value={{
        messages,
        setMessages,
        sendMessage,
        readyState,
        setReadyState,
        setTypingStatus,
        isTyping,
        isTypingHuman,
        closeChat,
        refreshSession,
        isLoadingMessages,
        setIsLoadingMessages,
        pendingMessages,
        isHumanSessionActive,
        setIsHumanSessionActive,
      }}
    >
      {children}
    </SupabaseContext.Provider>
  );
};
