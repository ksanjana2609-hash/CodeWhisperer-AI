import { useRef } from "react";
import "./ChatInput.css";

function ChatInput({
  question,
  setQuestion,
  askQuestion,
  uploadFile,
  mode,
  setMode,
}) {
  const fileRef = useRef();

  return (
    <div className="chat-input">

      <select
        value={mode}
        onChange={(e) => setMode(e.target.value)}
      >
        <option>Friendly</option>
        <option>Strict</option>
        <option>Beginner</option>
        <option>Interview</option>
        <option>Debug</option>
        <option value="Hint">Hint</option>
        <option value="Quiz">Quiz</option>
      </select>

      <input
        type="text"
        value={question}
        placeholder="Ask anything..."
        onChange={(e) => setQuestion(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            askQuestion();
          }
        }}
      />

      <button onClick={() => fileRef.current.click()}>
        📂
      </button>

      <input
        type="file"
        ref={fileRef}
        hidden
        accept=".cpp,.py,.java,.txt"
        onChange={(e) => {
            uploadFile(e.target.files[0]);
            e.target.value = "";
        }}
      />

      <button onClick={askQuestion}>
        Send
      </button>

    </div>
  );
}

export default ChatInput;