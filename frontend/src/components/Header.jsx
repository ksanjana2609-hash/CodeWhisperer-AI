import "./Header.css";

function Header({ clearChat }) {
  return (
    <header className="header">
      <div>
        <h2>🤖 CodeWhisperer AI</h2>
        <p>AI Programming Tutor</p>
      </div>

      <button className="clear-btn" onClick={clearChat}>
        🗑 Clear Chat
      </button>
    </header>
  );
}

export default Header;