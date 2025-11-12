import React, { useEffect, useState, useRef } from "react";
import { useChat } from "../../../chat/ChatProvider_old";
import { getSocket } from "../../../socket";

function AdminChat({ receiverId }) {
  const { userId, messages } = useChat();
  const socket = getSocket();
  const [input, setInput] = useState("");
  const chatRef = useRef();

  const filtered = messages.filter(
    (m) =>
      (m.senderId === userId && m.receiverId === receiverId) ||
      (m.senderId === receiverId && m.receiverId === userId)
  );

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [filtered]);

  const sendMessage = () => {
    if (!input.trim()) return;

    const msg = {
      senderId: userId,
      receiverId,
      message: input,
      timestamp: Date.now(),
    };

    socket.emit("sendMessage", msg);
    setInput("");
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <div
        ref={chatRef}
        style={{
          flex: 1,
          overflowY: "auto",
          padding: "10px",
          background: "#f8fafc",
        }}
      >
        {filtered.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.senderId === userId ? "right" : "left",
              marginBottom: "8px",
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                borderRadius: "8px",
                background: msg.senderId === userId ? "#6b46c1" : "#e2e8f0",
                color: msg.senderId === userId ? "#fff" : "#000",
              }}
            >
              {msg.message}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", padding: "8px" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type..."
          style={{
            flex: 1,
            padding: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={sendMessage}
          style={{
            marginLeft: "8px",
            background: "#6b46c1",
            color: "#fff",
            padding: "10px 16px",
            borderRadius: "8px",
            border: "none",
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default AdminChat;
