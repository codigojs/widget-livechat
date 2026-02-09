import { MdMessage, MdOutlineKeyboardArrowDown } from "react-icons/md";
import ChatBox from "./ChatBox";
import { useChatContext } from "../hooks/useChatContext";
import { useWidgetContext } from "../hooks/useWidgetContext";

export default function Bubble() {
  const { isOpen, setIsOpen, showChat, setShowChat } = useChatContext();
  const { config } = useWidgetContext();

  const toggleChat = () => {
    setIsOpen(!isOpen);
    setShowChat(!showChat);
  };

  const closeChat = () => {
    setShowChat(false);
    setIsOpen(false);
  };

  return (
    <>
      {(isOpen || showChat) && (
        <div
          style={{ zIndex: config?.zindex }}
          className="fixed inset-0 bg-black bg-opacity-80"
          onClick={toggleChat}
        />
      )}
      <div
        style={{ zIndex: config?.zindex }}
        className={`fixed bottom-6 ${config?.position === "left" ? "left-6" : "right-6"}`}
      >
        {showChat && <ChatBox onClose={closeChat} />}
        <button
          id="travelbot-bubble-button"
          name="travelbot Bubble Button"
          data-testid="travelbot-bubble-button"
          onClick={toggleChat}
          style={{
            backgroundColor: config?.button_color,
            color: config?.button_text_color,
            width: "60px",
            height: "60px",
          }}
          className="rounded-full flex items-center justify-center cursor-pointer transition-colors"
        >
          {showChat ? (
            <MdOutlineKeyboardArrowDown size={40} />
          ) : (
            <MdMessage size={30} />
          )}
        </button>
      </div>
    </>
  );
}