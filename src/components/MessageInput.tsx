import { useRef, useEffect, useState } from "react";
import { EmojiPicker } from "./EmojiPicker";

interface MessageInputProps {
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: () => void;
  textColor: string;
  buttonColor: string;
  submitText: string;
  readyState: boolean;
}

export function MessageInput({
  inputMessage,
  setInputMessage,
  handleSendMessage,
  textColor,
  buttonColor,
  submitText,
  readyState,
}: MessageInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleClick = () => {
    handleSendMessage();
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleEmojiSelect = (emoji: { emoji: string; label: string }) => {
    try {
      // Validar que el emoji existe
      if (!emoji?.emoji) {
        console.warn('Invalid emoji selected:', emoji);
        return;
      }

      // Obtener posición del cursor de forma más robusta
      let cursorPosition = inputMessage.length;
      if (textareaRef.current) {
        try {
          cursorPosition = textareaRef.current.selectionStart || inputMessage.length;
        } catch {
          console.warn('Could not get cursor position, using end of text');
        }
      }

      const textBeforeCursor = inputMessage.slice(0, cursorPosition);
      const textAfterCursor = inputMessage.slice(cursorPosition);
      const newMessage = textBeforeCursor + emoji.emoji + textAfterCursor;

      // Actualizar el mensaje
      setInputMessage(newMessage);

      // Cerrar el picker con un pequeño delay para asegurar que el evento se procese
      setTimeout(() => {
        setShowEmojiPicker(false);
      }, 50);

      // Restaurar foco y posición del cursor
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          try {
            textareaRef.current.focus();
            const newCursorPosition = cursorPosition + emoji.emoji.length;
            textareaRef.current.setSelectionRange(newCursorPosition, newCursorPosition);
          } catch {
            // Si falla el setSelectionRange, solo hacer focus
            textareaRef.current.focus();
          }
        }
      });

    } catch (error) {
      console.error('Error inserting emoji:', error);
      // Fallback: añadir al final del texto
      setInputMessage(inputMessage + emoji.emoji);
      setShowEmojiPicker(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [inputMessage]);

  return (
    <div className="border border-gray-200 rounded-xl bg-white p-1.5 shadow-sm">
      <div className="mb-3">
        <textarea
          data-testid="travelbot-chatbox-input"
          placeholder={readyState ? "Escribe un mensaje..." : "Chat inactivo..."}
          className="w-full resize-none border-none outline-none text-sm placeholder-gray-500 min-h-[40px] max-h-32 bg-white text-gray-900"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          aria-label="Message input"
          ref={textareaRef}
          disabled={!readyState}
          rows={1}
          style={{
            fontFamily: "inherit",
            lineHeight: 1.4,
            overflow: "hidden",
            backgroundColor: "#ffffff",
            color: "#111827"
          }}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative emoji-picker-container">
            <button
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-xl"
              title="Agregar emoji"
              disabled={!readyState}
              onMouseDown={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              onClick={(e: React.MouseEvent) => {
                e.preventDefault();
                e.stopPropagation();
                setShowEmojiPicker(!showEmojiPicker);
              }}
              type="button"
            >
              😊
            </button>
            {showEmojiPicker && (
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                onClose={() => setShowEmojiPicker(false)}
              />
            )}
          </div>
        </div>
        <div>
          <button
            data-testid="travelbot-chatbox-submit"
            style={{ backgroundColor: buttonColor, color: textColor }}
            className="px-3 py-1.5 rounded-lg transition-colors font-medium disabled:opacity-50 min-w-[70px] text-sm"
            onClick={handleClick}
            aria-label="Send message"
            disabled={!readyState || !inputMessage.trim()}
          >
            {submitText}
          </button>
        </div>
      </div>
    </div>
  );
}
