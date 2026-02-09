import { useState } from 'react';
import { LiveChatInitConfig } from '../types/types';
import { WidgetContext } from './WidgetContext';

export const WidgetProvider = ({ children }: { children: React.ReactNode }) => {
    const [config, setConfig] = useState<LiveChatInitConfig | null>(null);

    return (
        <WidgetContext.Provider value={{ config, setConfig }}>
            {children}
        </WidgetContext.Provider>
    );
};

