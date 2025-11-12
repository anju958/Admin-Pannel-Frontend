import React, { useState } from "react";
import ChatWindow from "../../../chat/ChatWindow";

export default function ChatButtonAndPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 120,
            right: 30,
            width: 650, // Increased width for better visibility
            height: 520,
            background: "white",
            borderRadius: 12,
            boxShadow: "0 4px 25px rgba(0,0,0,0.18)",
            overflow: "hidden",
            zIndex: 99999,
            display: "flex",
            flexDirection: "column"
          }}
        >
          <div
            style={{
              background: "#6b46c1",
              color: "white",
              padding: "12px 16px",
              fontWeight: 600,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            Chat
            <button
              onClick={() => setOpen(false)}
              style={{
                background: "transparent",
                border: "none",
                color: "white",
                fontSize: 22,
                cursor: "pointer"
              }}
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, minHeight: 0 }}>
            <ChatWindow />
          </div>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "#6b46c1",
          color: "white",
          fontSize: 26,
          border: "none",
          cursor: "pointer",
          boxShadow: "0 4px 20px rgba(0,0,0,0.26)",
          zIndex: 9999
        }}
        aria-label="Open chat"
      >
        💬
      </button>
    </>
  );
}
