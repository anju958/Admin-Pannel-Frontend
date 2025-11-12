import React, { useEffect, useRef } from "react";
import { useChat } from "./ChatContext";

export default function MessageList() {
  const { messages, me } = useChat();
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div style={{ padding: 12 }}>
      {messages.map((m, i) => {
        const mine = m.senderId === me.id;
        return (
          <div
            key={i}
            style={{
              textAlign: mine ? "right" : "left",
              marginBottom: 10
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "8px 12px",
                background: mine ? "#6b46c1" : "#e5e7eb",
                color: mine ? "#fff" : "#000",
                borderRadius: 12,
                maxWidth: "70%"
              }}
            >
              {m.message}
              <div style={{ fontSize: 11, opacity: 0.7 }}>
                {new Date(m.timestamp).toLocaleString()}
              </div>
            </div>
          </div>
        );
      })}
      <div ref={bottomRef} />
    </div>
  );
}
