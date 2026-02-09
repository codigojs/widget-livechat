import { UserMessage } from "./UserMessage";
import { BotMessage } from "./BotMessage";
import { LoadingMessage } from "./LoadingMessages";
import { Message } from "../types/types";


interface MessageListProps {
  messages: Message[];
  isLoadingMessages: boolean;
  messagesEndRef: React.RefObject<HTMLDivElement>;
  isTypingHuman: boolean;
}

export function MessageList({ messages, isLoadingMessages, messagesEndRef, isTypingHuman }: MessageListProps) {

  return (
    <div className="flex-grow bg-gray-100 rounded-lg p-3 overflow-y-auto mb-4 text-base">
      {messages.map((msg, index) =>
        msg.type === "user" ? (
          <UserMessage key={index} content={msg.content} timestamp={msg.timestamp} />
        ) : (
          <BotMessage key={index} content={msg.content} timestamp={msg.timestamp} />
        )
      )}
      {isLoadingMessages && <LoadingMessage />}
      {isTypingHuman && <LoadingMessage />}
      <div ref={messagesEndRef} />
    </div>
  );
}