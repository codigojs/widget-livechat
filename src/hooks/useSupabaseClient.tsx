import { useMemo, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useWidgetContext } from "./useWidgetContext";
import { getAuthToken } from "../services/authService";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string;

// Cache de tokens para evitar peticiones repetidas a custom-token
const tokenCache = new Map<string, { token: string; expiresAt: number }>();

let supabaseInstance: SupabaseClient | null = null;
let initializedSessionId: string | null = null;

export const useSupabaseClient = (): SupabaseClient | null => {
  const { config } = useWidgetContext();

  // TODO: Implementar cache de token
  const [token, setToken] = useState<string | null>(null);
  const sessionId = config?.session_id;
  const client = useMemo(() => {
    if (!sessionId) {
      return null;
    }

    // Si el session_id cambió, reinicializar la instancia
    if (initializedSessionId !== sessionId) {
      supabaseInstance = null;
      initializedSessionId = null;
    }

    if (!supabaseInstance) {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        accessToken: async () => {
          // Verificar si tenemos un token en cache válido
          const cached = tokenCache.get(sessionId);
          if (cached && cached.expiresAt > Date.now()) {
            return cached.token;
          }

          // Si no, obtener uno nuevo
          const tokenResponse = await getAuthToken(sessionId);
          const newToken = tokenResponse.token;

          // Cache por 55 minutos (5 minutos antes de expirar)
          tokenCache.set(sessionId, {
            token: newToken,
            expiresAt: Date.now() + (55 * 60 * 1000),
          });

          setToken(newToken);
          return newToken;
        },
      });
      supabaseInstance.realtime.setAuth(token);
      initializedSessionId = sessionId;
    }

    return supabaseInstance;
  }, [sessionId, token]);

  return client;
};
