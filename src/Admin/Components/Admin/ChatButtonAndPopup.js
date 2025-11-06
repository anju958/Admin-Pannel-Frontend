import React, { useState } from 'react';
import AdminChat from './AdminChat';

function ChatButtonAndPopup() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Chat popup modal */}
      {open && (
        <div
          style={{
            position: "fixed",
            bottom: 110, // Raised to make room for button
            right: 36,
            zIndex: 9999,
            boxShadow: "0 4px 24px rgba(0,0,0,0.16)",
            borderRadius: "12px",
            background: "#fff",
            maxWidth: "375px",
            width: "100%",
            height: "480px",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            padding: "16px", 
            background: "#6b46c1", 
            color: "#fff", 
            fontWeight: "600", 
            fontSize: 18,
            borderTopLeftRadius: "12px",
            borderTopRightRadius: "12px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}>
            <span> Chat</span>
            <button
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                fontSize: 22,
                cursor: "pointer"
              }}
              onClick={() => setOpen(false)}
            >
              ×
            </button>
          </div>
          <div style={{ flex: 1, background: "#f8fafc", overflowY: "auto", padding: "10px" }}>
            <AdminChat />
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        style={{
          position: "fixed",
          bottom: 36,
          right: 36,
          zIndex: 10000,
          background: "#6b46c1",
          color: "#fff",
          borderRadius: "50%",
          width: 58,
          height: 58,
          boxShadow: "0 2px 10px rgba(0,0,0,0.21)",
          border: "none",
          fontSize: 28,
          cursor: "pointer"
        }}
        onClick={() => setOpen(!open)}
        aria-label="Open Chat"
      >
        💬
      </button>
    </>
  );
}

export default ChatButtonAndPopup;
