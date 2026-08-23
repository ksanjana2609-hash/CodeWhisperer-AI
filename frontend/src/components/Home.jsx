import { useState } from "react";
import axios from "axios";

import Header from "./Header";
import Sidebar from "./Sidebar";
import ChatWindow from "./ChatWindow";
import ChatInput from "./ChatInput";
import Footer from "./Footer";

import "./Home.css";

function Home() {
  const [messages, setMessages] = useState([]);
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("Friendly");
  const [chats, setChats] = useState([]);

  async function askQuestion() {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setLoading(true);


    try {
      const response = await axios.post(
        "https://codewhisperer-ai.onrender.com/ask",
        {
          question: question,
          mode: mode,
        }
      );

      const aiMessage = {
        sender: "ai",
        text: response.data.answer,
      };

      const finalMessages = [...updatedMessages, aiMessage];

      setMessages(finalMessages);

      setChats((prevChats) => {
        const newChats = [...prevChats];

        if (newChats.length === 0) {
          newChats.push({
            title:
              question.length > 30
                ? question.substring(0, 30) + "..."
                : question,
            messages: finalMessages,
          });
        } else {
          newChats[newChats.length - 1] = {
            title:
              question.length > 30
                ? question.substring(0, 30) + "..."
                : question,
            messages: finalMessages,
          };
        }

        return newChats;
      });

    } catch (error) {
      console.log(error);
      console.log(error.response);
      console.log(error.response?.data);
      setMessages([
        ...updatedMessages,
        {
          sender: "ai",
          text: "❌ " + (error.response?.data?.detail || error.message),
        },
      ]);
    }

    setLoading(false);
    setQuestion("");
  }

  function newChat() {
    if (messages.length > 0) {
      setChats((prevChats) => [
        ...prevChats,
        {
          title: "New Chat",
          messages: [],
        },
      ]);
    }

    setMessages([]);
    setQuestion("");
  }

  function loadChat(index) {
    setMessages(chats[index].messages);
  }

  function clearChat() {
    setMessages([]);
    setQuestion("");
  }

  async function uploadFile(file) {
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  setLoading(true);

  try {
    const response = await axios.post(
      "https://codewhisperer-ai.onrender.com/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    const userMessage = {
      sender: "user",
      text: `📁 Uploaded: ${file.name}`,
    };

    const aiMessage = {
      sender: "ai",
      text: response.data.answer,
    };

    setMessages((prev) => [...prev, userMessage, aiMessage]);
  } catch (error) {
    setMessages((prev) => [
      ...prev,
      {
        sender: "ai",
        text: "❌ File upload failed.",
      },
    ]);
  }

  setLoading(false);
}

return (
  <div className="home">
    <Header clearChat={clearChat} />

    <div className="main-layout">
      <Sidebar
        chats={chats}
        newChat={newChat}
        loadChat={loadChat}
      />

      <div className="chat-section">
        <ChatWindow
          messages={messages}
          loading={loading}
        />

        <ChatInput
          question={question}
          setQuestion={setQuestion}
          askQuestion={askQuestion}
          uploadFile={uploadFile}
          mode={mode}
          setMode={setMode}
        />
      </div>
    </div>

    <Footer />
  </div>
);
}

export default Home;