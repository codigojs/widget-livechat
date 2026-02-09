import { X, Maximize2, Minimize2, RotateCcw } from "lucide-react";
import { useWidgetContext } from "../hooks/useWidgetContext";

interface HeaderProps {
  title: string;
  readyState: boolean;
  onClose: () => void;
  onToggleFullScreen: () => void;
  onRefreshSession: () => void;
  isFullScreen: boolean;
  backgroundColor: string;
  textColor: string;
}

export function Header({
  title,
  readyState,
  onClose,
  onToggleFullScreen,
  onRefreshSession,
  isFullScreen,
  backgroundColor,
  textColor,
}: HeaderProps) {
  const { config } = useWidgetContext();
  const defaultAvatar = `${import.meta.env.VITE_BASE_URL}/avatar.png`;

  return (
    <div className="flex justify-between items-center mb-4">
      <div className="flex items-center">
        {config?.avatar_url ? (
          <img
            src={config.avatar_url}
            alt="avatar"
            className="w-8 h-8 rounded-full mr-1.5"
          />
        ) : (
          <img
            src={defaultAvatar}
            alt="avatar"
            className="w-8 h-8 rounded-full mr-1.5"
          />
        )}
        <h3 className="text-[16px] font-semibold mr-2" style={{ color: textColor }}>{title}</h3>
        <span
          data-testid="travelbot-webchat-status"
          className={`inline-block w-3 h-3 rounded-full ${
            readyState ? "bg-green-500" : "bg-red-500"
          }`}
        ></span>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onRefreshSession}
          style={{ backgroundColor }}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          aria-label="Refrescar sesión"
          title="Refrescar sesión"
        >
          <RotateCcw size={20} />
        </button>
        <button
          onClick={onToggleFullScreen}
          style={{ backgroundColor }}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          aria-label={isFullScreen ? "Salir de pantalla completa" : "Pantalla completa"}
        >
          {isFullScreen ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
        </button>
        <button
          onClick={onClose}
          style={{ backgroundColor }}
          className="p-1 rounded hover:bg-gray-100 transition-colors"
          aria-label="Cerrar chat"
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
