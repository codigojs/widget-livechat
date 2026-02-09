import React from "react";
import TextMessage from "./TextMessage";

interface TransferMessageProps {
  text: string;
  agentName?: string;
  estimatedWaitTime?: number;
  isTransferring: boolean;
}

export const TransferMessage: React.FC<TransferMessageProps> = ({
  text,
  agentName,
  estimatedWaitTime,
  isTransferring,
}) => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
      <div className="flex items-center gap-2">
        {isTransferring && (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
        )}
        <TextMessage message={text} />
      </div>
      {agentName && (
        <p className="text-sm text-gray-600 mt-1">
          Agente: {agentName}
        </p>
      )}
      {estimatedWaitTime && (
        <p className="text-sm text-gray-600">
          Tiempo estimado: {estimatedWaitTime} minutos
        </p>
      )}
    </div>
  );
}; 