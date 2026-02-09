import React from "react";

interface UserMessageProps {
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

export function UserMessage({ content, timestamp }: UserMessageProps) {
  const formattedDate = formatDate(timestamp);

  return (
    <div className="flex items-end justify-end mb-4 max-w-[90%] ml-auto">
      <div className="mr-2 w-full">
        <div className="bg-gray-700 text-white p-3 text-[0.9rem] rounded-lg rounded-tr-none w-full text-right">
          <React.Fragment>{content}</React.Fragment>
        </div>
        <div>
          <p className="text-gray-500 text-right text-[0.6rem]">{formattedDate}</p>
        </div>
      </div>
    </div>
  );
}
