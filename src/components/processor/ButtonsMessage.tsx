import React from "react";
import TextMessage from "./TextMessage";
import type { ButtonOption } from "../../types/types";

interface ButtonsMessageProps {
  text: string;
  buttons: ButtonOption[];
  layout?: "horizontal" | "vertical";
}

export const ButtonsMessage: React.FC<ButtonsMessageProps> = ({
  text,
  buttons,
  layout = "horizontal",
}) => {
  return (
    <div className="flex flex-col gap-2">
      <TextMessage message={text} />
      <div className={`flex gap-2 ${layout === 'vertical' ? 'flex-col' : 'flex-wrap'}`}>
        {buttons.map((button) => (
          <button
            key={button.id}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
            onClick={button.onClick}
          >
            {button.text}
          </button>
        ))}
      </div>
    </div>
  );
}; 