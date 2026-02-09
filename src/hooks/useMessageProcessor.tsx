import { useState, useCallback } from "react";

import { useWidgetContext } from "./useWidgetContext";

import TextMessage from "../components/processor/TextMessage";
import { ConsentBanner } from "../components/processor/ConsentBanner";
import { SystemMessage } from "../components/processor/SystemMessage";
import { TransferMessage } from "../components/processor/TransferMessage";
import { ButtonsMessage } from "../components/processor/ButtonsMessage";
import { FormMessage } from "../components/processor/FormMessage";
import type {
  MessageReceive,
  Message,
  SupabaseMessage,
  ProcessedMessage,
  TextMessageContent,
  ConsentMessageContent,
  ButtonsMessageContent,
  FormMessageContent,
  TransferMessageContent,
  SystemMessageContent,
} from "../types/types";

export const useMessageProcessor = () => {
  const [processedMessages, setProcessedMessages] = useState<
    ProcessedMessage[]
  >([]);
  const { config } = useWidgetContext();

  const processMessage = useCallback(
    (message: MessageReceive): ProcessedMessage | null => {
      let processedMessage: ProcessedMessage = {} as ProcessedMessage;

      if (message.type === "message") {
        switch (message.content.type) {
          case "text": {
            const textContent = message.content as TextMessageContent;
            processedMessage = {
              type: "text",
              content: <TextMessage message={textContent.text} />,
              timestamp: message.timestamp || new Date().toISOString(),
            };
            break;
          }

          case "consent": {
            const consentContent = message.content as ConsentMessageContent;
            processedMessage = {
              type: "consent",
              content: (
                <ConsentBanner
                  text={consentContent.text}
                  url={consentContent.url || ""}
                />
              ),
              timestamp: message.timestamp || new Date().toISOString(),
            };
            break;
          }

          case "buttons": {
            const buttonsContent = message.content as ButtonsMessageContent;
            processedMessage = {
              type: "buttons",
              content: (
                <ButtonsMessage
                  text={buttonsContent.text}
                  buttons={buttonsContent.buttons}
                  layout={buttonsContent.layout}
                />
              ),
              timestamp: message.timestamp || new Date().toISOString(),
            };
            break;
          }

          case "form": {
            const formContent = message.content as FormMessageContent;
            processedMessage = {
              type: "form",
              content: (
                <FormMessage
                  title={formContent.title}
                  fields={formContent.fields}
                  submitText={formContent.submitText}
                  onSubmit={formContent.onSubmit}
                />
              ),
              timestamp: message.timestamp || new Date().toISOString(),
            };
            break;
          }

          case "transfer": {
            const transferContent = message.content as TransferMessageContent;
            processedMessage = {
              type: "transfer",
              content: (
                <TransferMessage
                  text={transferContent.text}
                  agentName={transferContent.agentName}
                  estimatedWaitTime={transferContent.estimatedWaitTime}
                  isTransferring={transferContent.isTransferring}
                />
              ),
              timestamp: message.timestamp || new Date().toISOString(),
            };
            break;
          }

          case "system": {
            const systemContent = message.content as SystemMessageContent;
            processedMessage = {
              type: "system",
              content: (
                <SystemMessage
                  text={systemContent.text}
                  variant={systemContent.variant}
                  icon={systemContent.icon}
                />
              ),
              timestamp: message.timestamp || new Date().toISOString(),
            };
            break;
          }

          default:
            console.warn(
              `Tipo de mensaje no soportado: ${message.content.type}`
            );
            return null;
        }

        setProcessedMessages((prevMessages) => [
          ...prevMessages,
          processedMessage,
        ]);
      }

      if (Object.keys(processedMessage).length > 0) {
        return processedMessage;
      }

      return null;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [config]
  );

  const formatMessage = (msg: SupabaseMessage): Message => {
    if (msg.role === "assistant" || msg.role === "human") {

      const processed = processMessage({
        type: "message",
        content: {
          type: "text",
          text: msg.content,
          timestamp: msg.created_at,
        },
        timestamp: msg.created_at,
      });
      return {
        type: msg.role,
        content: processed?.content,
        timestamp: msg.created_at,
      };
    }
    return { type: "user", content: msg.content, timestamp: msg.created_at };
  };

  return { processedMessages, processMessage, formatMessage };
};
