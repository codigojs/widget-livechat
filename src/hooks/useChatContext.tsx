import { useContext } from "react";
import { ChatContext } from "../context/ChatContext";

/**
 * Este hook permite acceder al contexto de ChatContext y
 * se utiliza para manejar el estado de la ventana de chat.
 */
export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChatContext must be used within a ChatProvider");
  }
  return context;
};
