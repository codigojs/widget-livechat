import r2wc from "@r2wc/react-to-web-component";
import App from "./App";
import { LiveChatInitConfig } from "./types/types";
import { WidgetProvider } from "./context/WidgetProvider";
import { validateWidgetDomain } from "./services/domainValidationService";

const WIDGET_NAME = "live-chat";

import widgetStyles from "./styles/main.css?inline";

// Function to create and append the widget to the DOM
const createWidget = async (config: LiveChatInitConfig) => {
  // Validate domain before initializing widget
  const validation = await validateWidgetDomain(config.agent_id);

  if (!validation.allowed) {
    console.error(
      "[LiveChat.init] Widget initialization BLOCKED - Domain not whitelisted:",
      validation.error
    );
    return;
  }
  const WrappedApp = () => {
    return (
      <App
        agent_id={config.agent_id}
        position={config.position || "right"}
        width={config.width || 70}
        height={config.height || 70}
        initial_message={config.initial_message || "Hola, ¿En que te puedo ayudar hoy?"}
        title={config.title || "LiveChat"}
        zindex={config.zindex || 99999999}
        button_color={config.button_color || "#e11d48"}
        submit_text={config.submit_text || "Enviar"}
        button_text_color={config.button_text_color || "#ffffff"}
        avatar_url={config.avatar_url || ""}
        full_screen={config.full_screen || false}
        text_color={config.text_color || "#000000"}
        consent_main={config.consent_main || false}
        consent_intro_message={config.consent_intro_message || "Debes aceptar nuestra Política de Privacidad para comenzar el chat."}
        consent_url={config.consent_url || ""}
      />
    );
  };

  const WidgetContext = r2wc(
    () => (
      <WidgetProvider>
        <WrappedApp />
      </WidgetProvider>
    ),
    {
      shadow: "open",
    }
  );

  if (!customElements.get(WIDGET_NAME)) {
    customElements.define(WIDGET_NAME, WidgetContext);
  }

  const widget = document.createElement(WIDGET_NAME);
  Object.entries(config).forEach(([key, value]) => {
    widget.setAttribute(key.replace(/([A-Z])/g, "-$1").toLowerCase(), value);
  });

  const shadowRoot = widget.shadowRoot;
  const style = document.createElement("style");
  style.textContent = widgetStyles;
  if (shadowRoot) {
    shadowRoot.appendChild(style);
    document.body.appendChild(widget);
  }
};

// Expose createWidget function globally
window.LiveChat = {
  init: createWidget,
  destroy: () => {
    document.querySelector(WIDGET_NAME)?.remove();
  }
};

export default { createWidget };
