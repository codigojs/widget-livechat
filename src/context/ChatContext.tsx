import { createContext } from "react";

interface ChatContextType {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    showChat: boolean;
    setShowChat: (value: boolean) => void;
  }

export const ChatContext = createContext<ChatContextType | undefined>(undefined);
