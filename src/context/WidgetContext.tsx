import { createContext } from "react";
import { LiveChatInitConfig } from '../types/types';

interface WidgetContextType {
    config: LiveChatInitConfig | null;
    setConfig: (config: LiveChatInitConfig) => void;
}

export const WidgetContext = createContext<WidgetContextType | undefined>(undefined);
