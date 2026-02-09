import { useState, useEffect } from "react";

interface EmojiData {
  emoji: string;
  label: string;
}

interface EmojiPickerProps {
  onEmojiSelect: (emoji: EmojiData) => void;
  onClose?: () => void;
}

const EMOJI_LIST: EmojiData[] = [
  // Expresiones básicas
  { emoji: '😊', label: 'Sonriente' },
  { emoji: '😂', label: 'Riendo' },
  { emoji: '😍', label: 'Enamorado' },
  { emoji: '🥰', label: 'Amor' },
  { emoji: '😘', label: 'Beso' },
  { emoji: '😉', label: 'Guiño' },
  { emoji: '😎', label: 'Genial' },
  { emoji: '🤗', label: 'Abrazo' },

  // Emociones
  { emoji: '😢', label: 'Triste' },
  { emoji: '😭', label: 'Llorando' },
  { emoji: '😅', label: 'Sudando' },
  { emoji: '😄', label: 'Feliz' },
  { emoji: '😃', label: 'Alegre' },
  { emoji: '😆', label: 'Riéndose' },
  { emoji: '🙂', label: 'Sonrisa ligera' },
  { emoji: '😇', label: 'Angelito' },

  // Reacciones
  { emoji: '👍', label: 'Me gusta' },
  { emoji: '👎', label: 'No me gusta' },
  { emoji: '👏', label: 'Aplausos' },
  { emoji: '🙌', label: 'Celebración' },
  { emoji: '👌', label: 'Perfecto' },
  { emoji: '✌️', label: 'Paz' },
  { emoji: '🤝', label: 'Acuerdo' },
  { emoji: '🙏', label: 'Gracias' },

  // Estados de ánimo
  { emoji: '😠', label: 'Enojado' },
  { emoji: '😡', label: 'Furioso' },
  { emoji: '🤬', label: 'Enfadado' },
  { emoji: '😤', label: 'Molesto' },
  { emoji: '🥺', label: 'Suplicante' },
  { emoji: '😔', label: 'Pensativo' },
  { emoji: '😌', label: 'Aliviado' },
  { emoji: '😒', label: 'Aburrido' },

  // Expresiones adicionales
  { emoji: '🙄', label: 'Ojos en blanco' },
  { emoji: '😲', label: 'Sorprendido' },
  { emoji: '😱', label: 'Asombrado' },
  { emoji: '🤔', label: 'Pensando' },
  { emoji: '😴', label: 'Durmiendo' },
  { emoji: '🤤', label: 'Babeando' },
  { emoji: '🥱', label: 'Bostezando' },
  { emoji: '😵', label: 'Mareado' }
];

export function EmojiPicker({ onEmojiSelect, onClose }: EmojiPickerProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Close on outside click with delay to prevent interference with emoji selection
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.emoji-picker-container')) {
        // Small delay to ensure emoji click events fire first
        setTimeout(() => {
          onClose?.();
        }, 100);
      }
    };

    // Use click instead of mousedown to avoid interference
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [onClose]);

  if (!isVisible) return null;

  const handleEmojiClick = (emojiData: EmojiData) => {
    try {
      // Validar datos del emoji
      if (!emojiData?.emoji) {
        console.warn('Invalid emoji data:', emojiData);
        return;
      }

      // Llamar al callback
      onEmojiSelect(emojiData);

      // Cerrar el picker
      setIsVisible(false);
      onClose?.();
    } catch (error) {
      console.error('Error selecting emoji:', error);
    }
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg p-3 emoji-picker-container">
      <div className="text-xs text-gray-500 mb-2 font-medium">Selecciona un emoji</div>
      <div className="grid grid-cols-6 gap-1 w-56 max-h-48 overflow-y-auto overflow-x-hidden">
        {EMOJI_LIST.map((emojiData) => (
          <button
            key={emojiData.emoji}
            onPointerDown={(e: React.PointerEvent) => {
              e.preventDefault();
              e.stopPropagation();
              // Ejecutar inmediatamente en pointerDown para evitar que se cierre
              handleEmojiClick(emojiData);
            }}
            onClick={(e: React.MouseEvent) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className="p-2 hover:bg-gray-100 rounded text-lg w-9 h-9 flex items-center justify-center transition-colors"
            title={emojiData.label}
            type="button"
          >
            {emojiData.emoji}
          </button>
        ))}
      </div>
    </div>
  );
}