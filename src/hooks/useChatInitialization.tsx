import { useEffect } from "react";

import { useSupabaseClient } from "./useSupabaseClient";
import { useSupabaseContext } from "../hooks/useSupabaseContext";
import { useWidgetContext } from "./useWidgetContext";
import { useMessageProcessor } from "./useMessageProcessor";

export function useChatInitialization() {
  const supabase = useSupabaseClient();
  const { setMessages, setIsLoadingMessages } = useSupabaseContext();
  const { config } = useWidgetContext();
  const { formatMessage } = useMessageProcessor();

  /**
   * Obtenemos el historial del chat
   * @param sessionId
   * @returns
   */
  const fetchHistory = async (sessionId: string) => {
    if (!supabase) return;

    setIsLoadingMessages(true);

    const { data, error } = await supabase
      .from("messages")
      .select("*")
      .eq("session_id", sessionId)
      .order("created_at", { ascending: true });

    if (error) {
      setIsLoadingMessages(false);
      return;
    }

    if (!Array.isArray(data)) {
      setIsLoadingMessages(false);
      return;
    }

    if (data.length > 0) {
      const formattedMessages = data.map(formatMessage);

      setMessages((prevMessages) => [
        ...prevMessages,
        ...formattedMessages,
      ]);
    }
    setIsLoadingMessages(false);
  };

  useEffect(() => {
    if (!config?.session_id) return;

    // Formateamos el mensaje inicial
    const formattedInitialMessage = formatMessage({
      role: "assistant",
      content: config?.initial_message,
      created_at: new Date().toISOString(),
      session_id: config.session_id || "",
      agent_id: config.agent_id || "",
      id: "",
    });

    setMessages((prevMessages) => [
      ...prevMessages,
      formattedInitialMessage,
    ]);

    // Consentimiento manejado desde Edge Function /chat (no duplicar aquí)

    // Obtenemos el historial del chat
    fetchHistory(config.session_id);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config?.session_id]);
}