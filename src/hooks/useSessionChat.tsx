import { useEffect, useCallback, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { useCookies } from "react-cookie";

interface UseSessionOptions {
  sessionDurationMinutes?: number; // Duración de la sesión en minutos
  inactivityTimeoutMinutes?: number; // Tiempo de inactividad antes de cerrar sesión
  onSessionExpired?: () => void; // Callback opcional cuando la sesión expira
}

export function useSession({
  sessionDurationMinutes = Number(import.meta.env.VITE_SESSION_DURATION_MINUTES) || 10,
  inactivityTimeoutMinutes = Number(import.meta.env.VITE_INACTIVITY_TIMEOUT_MINUTES) || 10,
  onSessionExpired,
}: UseSessionOptions = {}) {
  const [cookies, setCookie, removeCookie] = useCookies([
    "travelbot_session_id",
    "travelbot_session_expiry",
  ]);
  const inactivityTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Genera una nueva sesión con UUID y fecha de expiración
  const createNewSession = useCallback(async () => {
    const sessionId = uuidv4();
    const expiryDate = new Date(Date.now() + sessionDurationMinutes * 60 * 1000);
    const options = {
      path: "/",
      expires: expiryDate,
      secure: true,
    };

    setCookie("travelbot_session_id", sessionId, options);
    setCookie("travelbot_session_expiry", expiryDate.toISOString(), options);

    return sessionId;
  }, [setCookie, sessionDurationMinutes]);

  // Renueva la fecha de expiración de la sesión
  const renewSession = useCallback(
    async (sessionId: string) => {
      const expiryDate = new Date(Date.now() + sessionDurationMinutes * 60 * 1000);
      const options = {
        path: "/",
        expires: expiryDate,
        secure: true,
      };

      setCookie("travelbot_session_id", sessionId, options);
      setCookie("travelbot_session_expiry", expiryDate.toISOString(), options);
    },
    [setCookie, sessionDurationMinutes]
  );

  // Cierra la sesión (elimina cookies y cierra sesión en Supabase)
  const closeSession = useCallback(async () => {
    removeCookie("travelbot_session_id", { path: "/" });
    removeCookie("travelbot_session_expiry", { path: "/" });
    // Eliminar el consentimiento aceptado del localStorage
    localStorage.removeItem("consent_accepted");
    if (onSessionExpired) onSessionExpired();
  }, [removeCookie, onSessionExpired]);

  // Reinicia el temporizador de inactividad
  const resetInactivityTimer = useCallback(() => {
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    inactivityTimerRef.current = setTimeout(() => {
      closeSession();
    }, inactivityTimeoutMinutes * 60 * 1000);
  }, [closeSession, inactivityTimeoutMinutes]);

  // Inicializa o valida la sesión al montar el hook
  useEffect(() => {
    const initializeSession = async () => {
      let sessionId = cookies["travelbot_session_id"];
      const sessionExpiry = cookies["travelbot_session_expiry"];
      const now = new Date();

      // Si no hay sesión o ha expirado
      if (!sessionId || !sessionExpiry || new Date(sessionExpiry) < now) {
        sessionId = await createNewSession();
      } else {
        renewSession(sessionId);
      }

      // Iniciar el temporizador de inactividad
      resetInactivityTimer();

      return sessionId;
    };

    initializeSession();

    // Limpieza al desmontar
    return () => {
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    sessionId: cookies["travelbot_session_id"],
    renewSession,
    closeSession,
    resetInactivityTimer,
  };
}