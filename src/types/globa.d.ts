export {};

declare global {
  interface Window {
    LiveChat?: {
      init: (options: {
        agent_id: string;
        position: string;
        width: number;
        height: number;
        initial_message: string;
        text_color: string;
        title: string;
        button_color: string;
        button_text_color: string;
        submit_text: string;
        avatar_url: string;
        full_screen: boolean;
        zindex: number;
        consent_main: boolean;
        consent_intro_message: string;
        consent_url: string;
      }) => void;
      destroy: () => void;
    };
  }
}
