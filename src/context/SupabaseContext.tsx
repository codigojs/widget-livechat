import { createContext } from "react";

import  { Message } from "../types/types";

interface SupabaseContextType {
  messages: Message[];
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
  sendMessage: (message: string) => void;
  readyState: boolean,
  setReadyState: React.Dispatch<React.SetStateAction<boolean>>;
  isLoadingMessages: boolean;
  setIsLoadingMessages: React.Dispatch<React.SetStateAction<boolean>>;
  setTypingStatus: (typing: boolean) => void;
  isTyping: boolean;
  isTypingHuman: boolean;
  closeChat: () => Promise<void>;
  refreshSession: () => Promise<void>;
  pendingMessages: number;
  isHumanSessionActive: boolean;
  setIsHumanSessionActive: React.Dispatch<React.SetStateAction<boolean>>;
}

export const SupabaseContext = createContext<SupabaseContextType | undefined>(undefined);
