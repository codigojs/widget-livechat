import { ChatBackendResponse } from "../types/types";
import { getAuthToken } from "./authService";

/**
 * Consultamos el backend de Agentes IA para generar la respuesta
 * @param content
 * @param agentId
 * @param sessionId
 * @returns
 */
export const chatLiveService = async (
  content: string,
  agentId: string,
  sessionId: string
): Promise<ChatBackendResponse> => {
  try {
    // Obtener JWT válido de custom-token
    const authTokenResponse = await getAuthToken(sessionId);
    const jwtToken = authTokenResponse.token;

    // Usar la nueva URL del backend de Python/CrewAI
    const backendUrl = import.meta.env.VITE_AGENT_IA_BACKEND_URL;

    const response = await fetch(
      backendUrl,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: content,
          agent_id: agentId,
          session_id: sessionId,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.detail || 'Unknown error'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error querying agent backend:", error);
    throw error;
  }
};
