import React, { useEffect, useRef, useState } from "react";
import { useChat } from "./ChatContext";

export default function ChatBox({ peerId, peerName }) {
  const { messages, sendMessageTo, currentConversation } = useChat();
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (!peerId || !text.trim()) return;
    sendMessageTo(peerId, text.trim());
    setText("");
  };

  // Scroll to latest message
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, currentConversation]);

  const chatMessages = messages[currentConversation] || [];

  return (
    <div className="chatbox-container">
      {peerId ? (
        <>
          <div className="chat-header">
            <h5>{peerName || "User"}</h5>
          </div>

          <div className="chat-messages">
            {chatMessages.length === 0 ? (
              <div className="no-messages">Start conversation...</div>
            ) : (
              chatMessages.map((msg, i) => (
                <div
                  key={i}
                  className={`chat-message ${
                    msg.senderId === peerId ? "received" : "sent"
                  }`}
                >
                  <div className="message-text">{msg.message}</div>
                  <div className="message-time">
                    {new Date(msg.timestamp || Date.now()).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="chat-input-container">
            <input
              type="text"
              placeholder="Type your message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button onClick={handleSend}>Send</button>
          </div>
        </>
      ) : (
        <div className="no-user-selected">Select a user to start chat</div>
      )}
    </div>
  );
}
