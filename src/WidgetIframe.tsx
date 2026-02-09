import r2wc from "@r2wc/react-to-web-component";
import AppIframe from "./AppIframe";
import { LiveChatInitConfig } from "./types/types";
import widgetStyles from "./styles/main.css?inline";
import { WidgetProvider } from "./context/WidgetProvider";
import { validateWidgetDomain } from "./services/domainValidationService";

const getUrlParams = (): LiveChatInitConfig => {
  const params = new URLSearchParams(window.location.search);
  return {
    agent_id: params.get('agent_id') || '',
    position: params.get('position') || 'right',
    width: Number(params.get('width')) || 70,
    height: Number(params.get('height')) || 70,
    initial_message: params.get('initial_message') || 'Hola, ¿En que te puedo ayudar hoy?',
    title: params.get('title') || 'LiveChat',
    zindex: Number(params.get('zindex')) || 99999999,
    button_color: params.get('button_color') || '#e11d48',
    submit_text: params.get('submit_text') || 'Enviar',
    button_text_color: params.get('button_text_color') || '#ffffff',
    avatar_url: params.get('avatar_url') || '/avatar.png',
    full_screen: params.get('full_screen') === 'true',
    text_color: params.get('text_color') || '#000000',
    consent_main: params.get('consent_main') === 'true',
    consent_intro_message: params.get('consent_intro_message') || 'Debes aceptar nuestra Política de Privacidad para comenzar el chat.',
    consent_url: params.get('consent_url') || ''
  };
};

const createIframeWidget = async (config?: LiveChatInitConfig) => {
  // Si no se proporciona config, intentamos obtener los parámetros de la URL
  const finalConfig = config || getUrlParams();

  if (!finalConfig.agent_id) {
    console.error('No se proporcionó un agent_id válido');
    return;
  }

  // Validate domain before initializing widget
  const validation = await validateWidgetDomain(finalConfig.agent_id);

  if (!validation.allowed) {
    console.error(
      "[LiveChat.init] Widget initialization BLOCKED - Domain not whitelisted:",
      validation.error
    );
    return;
  }

  const WrappedApp = () => {
    return (
      <AppIframe
        agent_id={finalConfig.agent_id}
        position={finalConfig.position}
        width={finalConfig.width}
        height={finalConfig.height}
        initial_message={finalConfig.initial_message}
        title={finalConfig.title}
        zindex={finalConfig.zindex}
        button_color={finalConfig.button_color}
        submit_text={finalConfig.submit_text}
        button_text_color={finalConfig.button_text_color}
        avatar_url={finalConfig.avatar_url}
        full_screen={finalConfig.full_screen}
        text_color={finalConfig.text_color}
        consent_main={finalConfig.consent_main}
        consent_intro_message={finalConfig.consent_intro_message}
        consent_url={finalConfig.consent_url}
      />
    );
  }

  const IframeWidget = r2wc(
    () => (
      <WidgetProvider>
        <WrappedApp {...{}} />
      </WidgetProvider>
    ),
    {
      shadow: "open"
  });

  if (!customElements.get("iframe-chat")) {
    customElements.define("iframe-chat", IframeWidget);
  }

  const widget = document.createElement("iframe-chat");
  Object.entries(finalConfig).forEach(([key, value]) => {
    widget.setAttribute(key.replace(/([A-Z])/g, "-$1").toLowerCase(), value);
  });
  document.body.appendChild(widget);

  const shadowRoot = widget.shadowRoot;
  const style = document.createElement("style");
  style.textContent = widgetStyles;
  if (shadowRoot) {
    shadowRoot.appendChild(style);
  }
};

window.LiveChat = {
  init: createIframeWidget,
  destroy: () => {
    document.querySelector("iframe-chat")?.remove();
  }
};

export default {};