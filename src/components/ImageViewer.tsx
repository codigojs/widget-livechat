import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface ImageViewerProps {
  fileName: string;
  imageUrl: string;
  onClose: () => void;
  isOpen: boolean;
}

export function ImageViewer({ fileName, imageUrl, onClose, isOpen }: ImageViewerProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      id="image-viewer-modal"
      tabIndex={-1}
      aria-hidden="true"
      className="overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 flex justify-center items-center w-full inset-0 h-full bg-black bg-opacity-50"
      onClick={onClose}
    >
      <div className="relative p-4 w-full max-w-4xl max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          {/* Modal header */}
          <div className="flex items-center justify-between p-2 md:p-3 border-b rounded-t">
            <h3 className="text-xl font-semibold text-gray-900">
              {fileName}
            </h3>
            <button
              type="button"
              className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
              onClick={onClose}
            >
              <X size={24} />
              <span className="sr-only">Cerrar modal</span>
            </button>
          </div>
          {/* Modal body */}
          <div className="p-4 md:p-5">
            <img
              src={imageUrl}
              alt="Vista de pantalla completa"
              className="max-h-[70vh] max-w-full object-contain mx-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
