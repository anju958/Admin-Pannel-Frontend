import React, { useState } from "react";
import { useChat } from "./ChatContext";
import UserList from "./UserList";
import ChatBox from "./ChatBox";

export default function ChatButtonAndPopup() {
  const [open, setOpen] = useState(false);
  const { socketReady, loading } = useChat();

  return (
    <>
      <div style={{ position: "fixed", right: 24, bottom: 24 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#673ab7",
            color: "#fff",
            border: "none",
            fontWeight: "bold",
            boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
            cursor: "pointer",
          }}
        >
          Chat
        </button>
      </div>

      {open && (
        <div
          style={{
            position: "fixed",
            right: 24,
            bottom: 96,
            width: 420,
            height: 550,
            background: "#fff",
            borderRadius: 12,
            boxShadow: "0 12px 28px rgba(0,0,0,0.2)",
            display: "flex",
            overflow: "hidden",
            zIndex: 9999,
          }}
        >
          <div style={{ width: 150, borderRight: "1px solid #eee" }}>
            {loading ? (
              <div style={{ padding: 12, textAlign: "center" }}>
                Connecting to chat...
              </div>
            ) : (
              <UserList />
            )}
          </div>
          <div style={{ flex: 1 }}>
            {!socketReady ? (
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "100%",
                  fontSize: 14,
                  color: "#555",
                }}
              >
                Connecting to chat...
              </div>
            ) : (
              <ChatBox />
            )}
          </div>
        </div>
      )}
    </>
  );
}
