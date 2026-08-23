import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function MessageBubble({ sender, text }) {
  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      const [copied, setCopied] = useState(false);
      const copyCode = async (code) => {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 1500);
      };
    } catch {
      alert("Failed to copy.");
    }
  };

  return (
    <div className={sender === "user" ? "user-message" : "ai-message"}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code(props) {
            const { children, className } = props;
            const match = /language-(\w+)/.exec(className || "");
            const code = String(children).replace(/\n$/, "");

            if (match) {
              return (
                <div style={{ position: "relative" }}>
                  <button
                    onClick={() => copyCode(code)}
                    style={{
                      position: "absolute",
                      top: "8px",
                      right: "8px",
                      zIndex: 10,
                      background: "#4f46e5",
                      color: "white",
                      border: "none",
                      borderRadius: "5px",
                      padding: "4px 8px",
                      cursor: "pointer",
                    }}
                  >
                    📋 Copy
                  </button>

                  <SyntaxHighlighter
                    language={match[1]}
                    style={oneDark}
                    PreTag="div"
                  >
                    {code}
                  </SyntaxHighlighter>
                </div>
              );
            }

            return (
            <code className={className}>
              {children}
              </code>
              );
            },
          }}
      >
        {text}
      </ReactMarkdown>
    </div>
  );
}

export default MessageBubble;