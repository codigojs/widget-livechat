import { getAuthToken } from './authService';

interface AgentData {
  active: boolean;
  session_id: string;
  // Añade aquí más propiedades según la respuesta de tu API
}

/**
 * Obtiene la información del agente
 * @param agentId - ID del agente
 * @param sessionId - ID de la sesión para obtener JWT
 * @returns Información del agente
 */
export const getAgentData = async (agentId: string, sessionId: string): Promise<AgentData> => {
  try {
    // Obtener JWT válido
    const tokenResponse = await getAuthToken(sessionId);
    const jwt = tokenResponse.token;

    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/agent?agent_id=${agentId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwt}`,
          'Content-Type': 'application/json;charset=utf-8'
        }
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener datos del agente: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getAgentData:', error);
    throw error;
  }
};

/**
 * Verifica si el agente está activo
 * @param agentId - ID del agente
 * @param sessionId - ID de la sesión para obtener JWT
 * @returns boolean indicando si el agente está activo
 */
export const isAgentActive = async (agentId: string, sessionId: string): Promise<boolean> => {
  try {
    const agentData = await getAgentData(agentId, sessionId);
    return agentData.active;
  } catch (error) {
    console.error('Error al verificar estado del agente:', error);
    return false;
  }
};
