import { useWidgetContext } from "../../hooks/useWidgetContext";

interface ConsentBannerProps {
  text: string;
  url: string;
}

export function ConsentBanner({
  text,
  url,
}: ConsentBannerProps) {
  const { config } = useWidgetContext();

  if (!config?.consent_main) return null;

  return (
    <div className=" rounded-lg p-0 mb-4 text-gray-900">
      <div className="flex items-start">
        <div className="flex-shrink-0">
        </div>
        <div className="ml-0 flex-1">
          <div className="mt-2 text-sm">
            <p>{text}</p>
            <p className="mt-2">
              <a
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-500 underline"
                style={{ color: "#2563eb" }}
              >
                Leer Política de Privacidad completa
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
