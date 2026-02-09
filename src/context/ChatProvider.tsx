import React, { useState } from "react";
import { ChatContext } from "./ChatContext";

/**
 * Este Provider se encarga de manejar el estado de la ventana de chat.
 */
export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showChat, setShowChat] = useState(false);

  return (
    <ChatContext.Provider
      value={{
        isOpen,
        setIsOpen,
        showChat,
        setShowChat,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
