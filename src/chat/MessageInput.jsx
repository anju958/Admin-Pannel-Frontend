import React, { useState } from "react";
import { useChat } from "./ChatContext";

export default function MessageInput() {
  const { sendMessage, activePeer } = useChat();
  const [text, setText] = useState("");

  const onSend = async () => {
    if (!activePeer || !text.trim()) return;
    await sendMessage(text.trim());
    setText("");
  };

  return (
    <div style={{ display: "flex", padding: 10 }}>
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={!activePeer}
        placeholder={activePeer ? "Type your message..." : "Select a user to chat"}
        onKeyDown={(e) => e.key === "Enter" && onSend()}
        style={{
          flex: 1,
          border: "1px solid #ccc",
          borderRadius: 8,
          padding: "10px 12px"
        }}
      />
      <button
        onClick={onSend}
        disabled={!activePeer || !text.trim()}
        style={{
          marginLeft: 8,
          padding: "0 16px",
          borderRadius: 8,
          border: 0,
          background: "#6b46c1",
          color: "#fff"
        }}
      >
        Send
      </button>
    </div>
  );
}
