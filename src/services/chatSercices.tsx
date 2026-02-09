import { VectorDbResponse } from "../types/types";
import { getAuthToken } from "./authService";

/**
 * Consultamos la base de datos vectorial para generar la respuesta
 * @param content
 * @param agentId
 * @param sessionId
 * @returns
 */
export const chatLiveService = async (
  content: string,
  agentId: string,
  sessionId: string
): Promise<VectorDbResponse> => {
  try {
    // Obtener JWT válido de custom-token
    const authTokenResponse = await getAuthToken(sessionId);
    const jwtToken = authTokenResponse.token;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${jwtToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: content,
          agent_id: agentId,
          session_id: sessionId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error querying vector database:", error);
    throw error;
  }
};
