import { useEffect } from "react";

import { LiveChatInitConfig } from "./types/types";
import { ChatProvider } from "./context/ChatProvider";
import { useWidgetContext } from "./hooks/useWidgetContext";
import Container from "./components/Container";


export default function IframeChat({
  agent_id,
  position,
  width,
  height,
  initial_message,
  text_color,
  title,
  zindex,
  button_color,
  button_text_color,
  submit_text,
  avatar_url,
  full_screen,
  consent_main,
  consent_intro_message,
  consent_url,
}: LiveChatInitConfig) {
  const { setConfig } = useWidgetContext();
  useEffect(() => {
    setConfig({
      agent_id,
      position,
      width,
      height,
      title,
      text_color,
      initial_message,
      zindex,
      button_color,
      submit_text,
      button_text_color,
      avatar_url,
      full_screen,
      consent_main,
      consent_intro_message,
      consent_url,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ChatProvider>
      <Container />
    </ChatProvider>
  );
}