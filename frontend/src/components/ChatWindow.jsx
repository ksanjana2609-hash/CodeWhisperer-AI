import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import Loader from "./Loader";
import "./ChatWindow.css";

function ChatWindow({ messages, loading }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, loading]);

  return (
    <div className="chat-window">
      {messages.length === 0 && (
        <div className="welcome">
          <h2>👋 Welcome to CodeWhisperer AI</h2>

          <p>Your Intelligent Programming Tutor</p>

          <br />

          <h3>Try asking:</h3>

          <ul>
            <li>Explain Binary Search</li>
            <li>Write a C++ program for Merge Sort</li>
            <li>Debug this Python code</li>
            <li>Explain Time Complexity</li>
          </ul>
        </div>
      )}

      {messages.map((msg, index) => (
        <MessageBubble
          key={index}
          sender={msg.sender}
          text={msg.text}
        />
      ))}

      {loading && <Loader />}

      <div ref={bottomRef}></div>
    </div>
  );
}

export default ChatWindow;
