import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import rehypeRaw from "rehype-raw";
import DOMPurify from "dompurify";

interface TextMessageProps {
  message: string;
  is_history?: boolean;
}

export default function TextMessage({ message }: TextMessageProps) {
  const sanitizedMessage = DOMPurify.sanitize(message);

  return (
    <div className="mb-2 mt-2 text-[0.9rem] text-gray-900" style={{ color: "#111827" }}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm, remarkBreaks]}
        rehypePlugins={[rehypeRaw]}
        components={{
          a: (props) => (
            <a
              {...props}
              className="text-blue-500 underline"
              target="_blank"
              rel="noopener noreferrer"
            />
          ),
          p: (props) => {
            const { className, ...rest } = props;
            const mergedClassName = `py-2 ${className || ""}`.trim();
            return <p className={mergedClassName} {...rest} />;
          },
          h1: ({ className, ...rest }) => (
            <h1
              className={`text-xl font-semibold py-2 ${className || ""}`.trim()}
              {...rest}
            />
          ),
          h2: ({ className, ...rest }) => (
            <h2
              className={`text-lg font-semibold py-2 ${className || ""}`.trim()}
              {...rest}
            />
          ),
          h3: ({ className, ...rest }) => (
            <h3
              className={`text-base font-semibold py-1 mt-2 ${className || ""}`.trim()}
              {...rest}
            />
          ),
        }}
      >
        {sanitizedMessage}
      </ReactMarkdown>
    </div>
  );
}
