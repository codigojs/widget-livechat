export function LoadingMessage() {

  return (
    <div className="flex items-start mb-4">
      <div className="max-w-[80%]">
        <div className="bg-gray-200 p-3 rounded-lg rounded-tl-none">
          <div className="flex space-x-2">
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
