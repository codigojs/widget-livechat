export const getAuthToken = async (sessionId: string) => {
    const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/custom-token`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ session_id: sessionId }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error al obtener el token de autenticación: ${response.status}`);
    }

    return await response.json();
}