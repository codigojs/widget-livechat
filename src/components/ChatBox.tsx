import { useState, useEffect, useRef } from "react";

import { useWidgetContext } from "../hooks/useWidgetContext";
import { useSupabaseContext } from "../hooks/useSupabaseContext";
import { SupabaseProvider } from "../context/SupabaseProvider";
import { useChatInitialization } from "../hooks/useChatInitialization";
import { useSession } from "../hooks/useSessionChat";

import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { Header } from "./Header";

interface ChatBoxProps {
  onClose: () => void;
}

export default function ChatBox({ onClose }: ChatBoxProps) {
  return (
    <SupabaseProvider enabled={true}>
      <ChatBoxContent onClose={onClose} />
    </SupabaseProvider>
  );
}

const ChatBoxContent = ({ onClose }: ChatBoxProps) => {
  const { config, setConfig } = useWidgetContext();
  const {
    messages,
    sendMessage,
    readyState,
    isLoadingMessages,
    setIsLoadingMessages,
    isTypingHuman,
    setTypingStatus,
    closeChat,
    refreshSession,
  } = useSupabaseContext();
  const { sessionId } = useSession({
    onSessionExpired: () => {
      // Cerrar el chat
      onClose();
    },
  });
  const [inputMessage, setInputMessage] = useState("");
  const typingTimeout = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isFullScreen, setIsFullScreen] = useState(config?.full_screen || false);

  // Ref para rastrear si ya estamos en estado "typing" (evita llamadas redundantes a track())
  const isTypingRef = useRef(false);

  // Scroll to the bottom of the chat box when the messages array changes
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Init Chat, get the last message from the websocket
  useChatInitialization();

  // Scroll to the bottom of the chat box when the messages array changes
  useEffect(scrollToBottom, [messages, isTypingHuman]);

  useEffect(() => {
    if (!sessionId || !config || !config.agent_id) return;

    // Evitar reescribir el mismo session_id si ya está establecido
    if (config.session_id !== sessionId) {
      setConfig({
        ...config,
        session_id: sessionId,
      });
    }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  /**
   * Handle the send message action
   */
  const handleSendMessage = () => {
    setIsLoadingMessages(true);

    sendMessage(inputMessage);
    setInputMessage("");

    // Resetear estado de typing al enviar mensaje
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
      typingTimeout.current = null;
    }
    if (isTypingRef.current) {
      setTypingStatus(false);
      isTypingRef.current = false;
    }
  };

  const handleTyping = (value: string) => {
    setInputMessage(value);

    // Solo llamar a setTypingStatus(true) si NO estamos ya en estado typing
    // Esto evita llamadas redundantes a channel.track() en cada keystroke
    if (!isTypingRef.current) {
      setTypingStatus(true);
      isTypingRef.current = true;
    }

    // Resetear el timeout en cada keystroke
    if (typingTimeout.current) {
      clearTimeout(typingTimeout.current);
    }

    // Después de 2 segundos sin actividad, marcar como "no escribiendo"
    typingTimeout.current = setTimeout(() => {
      setTypingStatus(false);
      isTypingRef.current = false;
    }, 2000);
  };

  /**
   * Handle the close chat action
   */
  const handleClose = async () => {
    await closeChat();
    onClose();
  };

  const toggleFullScreen = () => {
    setIsFullScreen(!isFullScreen);
  };

  return (
    <div
      data-testid="travelbot-chatbox"
      style={{
        backgroundColor: config?.background_color || "#ffffff",
        zIndex: config?.zindex,
      }}
      className={`fixed rounded ${
        isFullScreen 
          ? "inset-0 w-full h-full" 
          : "md:absolute bottom-0 md:bottom-full top-0 md:top-auto md:mb-2.5 w-full md:w-[400px]"
      } ${
        !isFullScreen && (config?.position === "left" ? "left-0 md:left-4" : "right-0 md:right-4")
      }`}
    >
      <div
        style={{ backgroundColor: config?.background_color }}
        className={`rounded-lg shadow-lg p-4 flex flex-col h-full ${
          isFullScreen ? "md:h-full" : "md:h-[75vh] md:rounded-lg"
        }`}
      >
        <Header
          title={config?.title || "Chat"}
          readyState={readyState}
          onClose={handleClose}
          onToggleFullScreen={toggleFullScreen}
          onRefreshSession={refreshSession}
          isFullScreen={isFullScreen}
          backgroundColor={config?.background_color || "#ffffff"}
          textColor={config?.text_color || "#000000"}
        />
        <MessageList
          messages={messages}
          isLoadingMessages={isLoadingMessages}
          isTypingHuman={isTypingHuman}
          messagesEndRef={messagesEndRef}
        />

        <MessageInput
          inputMessage={inputMessage}
          setInputMessage={handleTyping}
          handleSendMessage={handleSendMessage}
          buttonColor={config?.button_color || "#e11d48"}
          textColor={config?.button_text_color || "#fff"}
          submitText={config?.submit_text || "Enviar"}
          readyState={readyState}
        />
        <p className="mt-2 text-gray-400">
          <a
            className="text-center text-xs"
            href="https://mychatbot.es"
            target="_blank"
          >
            Powered by MyChatbot.es
          </a>
        </p>
      </div>
    </div>
  );
};
