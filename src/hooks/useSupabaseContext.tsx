import { useContext } from 'react';
import { SupabaseContext } from '../context/SupabaseContext';

export const useSupabaseContext = () => {
    const context = useContext(SupabaseContext);
    if (context === undefined) {
      throw new Error('useSupabaseContext debe ser usado dentro de un SupabaseProvider');
    }
    return context;
  };
  