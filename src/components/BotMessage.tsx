import React from "react";

interface BotMessageProps {
  content: React.ReactNode;
  timestamp: string;
}

const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  return new Intl.DateTimeFormat('es', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false // Usar formato de 24 horas
  }).format(date);
};

export function BotMessage({ content, timestamp }: BotMessageProps) {
  const formattedDate = formatDate(timestamp);

  return (
    <div className="flex items-start mb-4 max-w-[90%] mr-auto">
      <div
        id="bot-message-icon"
        data-testid="travelbot-bot-message-icon"
        className="rounded-full flex items-center justify-center mr-0"
      >
      </div>
      <div
        id="bot-message-message"
        className="w-full break-words overflow-hidden"
      >
        <div className="bg-gray-200 p-3 rounded-lg rounded-tl-none text-left">
          <React.Fragment>{content}</React.Fragment>
        </div>
        <div>
          <p className=" text-gray-500 text-[0.6rem] text-left">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
