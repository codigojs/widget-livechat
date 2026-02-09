// Extrae el dominio desde el navegador

export function useExtractDomain(level: number = 2) {
  try {
    const hostname = window.location.hostname;
    const parts = hostname.split(".");

      const topDomainParts = parts.slice(-level);
      return `.${topDomainParts.join(".")}`;
  } catch (error) {
    console.error("Error extrayendo el dominio del navegador:", error);
    return '';
  }
}
