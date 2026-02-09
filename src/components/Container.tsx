import { useEffect } from "react";
import ChatBox from "./ChatBox";
import { useWidgetContext } from "../hooks/useWidgetContext";

export default function Container() {
  const { config } = useWidgetContext();

  useEffect(() => {
  }, [config]);

  return (
    <div className="fixed inset-0 flex items-center justify-center">
      {config && <ChatBox onClose={() => {}} />}
    </div>
  );
}