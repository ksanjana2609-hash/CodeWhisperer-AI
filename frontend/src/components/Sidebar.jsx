import "./Sidebar.css";
import { FaPlus, FaComments } from "react-icons/fa";

function Sidebar({ chats, newChat, loadChat }) {
  return (
    <div className="sidebar">
      <h2 className="logo">🤖 CodeWhisperer</h2>

      <button className="new-chat-btn" onClick={newChat}>
        <FaPlus />
        <span>New Chat</span>
      </button>

      <div className="history">
        <h3>Recent Chats</h3>

        {chats.map((chat, index) => (
          <div
            key={index}
            className="history-item"
            onClick={() => loadChat(index)}
          >
            <FaComments />
            <span>{chat.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Sidebar;