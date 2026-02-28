import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { WidgetProvider } from "./context/WidgetProvider.tsx";
import "./styles/index.css";

const renderApp = () => {
  const rootElement = document.getElementById("root");
  if (!rootElement) throw new Error("Elemento raíz no encontrado");

  // AGENT_ID para desarrollo
  const AGENT_ID = import.meta.env.VITE_TRAVELBOT_AGENT_ID || "f6e4db92-bab8-43a9-866f-89a3c557e850";
  console.log(AGENT_ID)

  createRoot(rootElement).render(
    <StrictMode>
      <WidgetProvider>
        <App
          agent_id={AGENT_ID}
          position="right"
          width={70}
          height={70}
          initial_message="Hola, ¿En que te puedo ayudar hoy?"
          title="LiveChat"
          zindex={99999999}
          button_color="#e11d48"
          submit_text="Enviar"
          button_text_color="#ffffff"
          avatar_url=""
          full_screen={false}
          text_color="#000000"
          consent_main={true}
          consent_intro_message="Al continuar aceptas nuestra Política de Privacidad. Emplearemos, como responsables del tratamiento, los datos que nos proporciones para atender tu solicitud. Consulta nuestra Política de Privacidad para conocer tus derechos y cómo ejercerlos."
          consent_url="https://mychatbot.es/privacy-policy"
          />
      </WidgetProvider>
    </StrictMode>
  );
};

renderApp();
