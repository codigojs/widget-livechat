import { useContext } from 'react';
import { WidgetContext } from '../context/WidgetContext'

export const useWidgetContext = () => {
    const context = useContext(WidgetContext);
    if (context === undefined) {
        throw new Error('useWidgetContext must be used within a WidgetProvider');
    }
    return context;
};

