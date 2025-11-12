import React from "react";
import { useChat } from "./ChatContext";
import UserList from "./UserList";
import MessageList from "./MessageList";
import MessageInput from "./MessageInput";
import { useAuth } from "../Context/AuthContext";

export default function ChatWindow() {
  const { user } = useAuth();
  const { socketReady, users, currentConversation, openConversationWith } = useChat();

  if (!user) {
    return (
      <div style={{ padding: 16 }}>
        <b>Please login to use chat.</b>
      </div>
    );
  }

  const activeUser = users.find((u) =>
    currentConversation
      ? currentConversation.includes(u._id)
      : false
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "180px 1fr",
        height: "100%",
        background: "#fff",
      }}
    >
      {/* Left sidebar */}
      <div style={{ borderRight: "1px solid #ddd", overflowY: "auto" }}>
        <UserList onSelectUser={(u) => openConversationWith(u._id)} />
      </div>

      {/* Chat area */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div
          style={{
            padding: 12,
            borderBottom: "1px solid #ddd",
            display: "flex",
            justifyContent: "space-between",
            fontWeight: 600,
          }}
        >
          <span>
            {activeUser ? activeUser.name : "Select a user"}
          </span>
          <span style={{ color: socketReady ? "green" : "gray" }}>
            {socketReady ? "online" : "offline"}
          </span>
        </div>

        <div style={{ flex: 1, overflowY: "auto", background: "#f8fafc" }}>
          <MessageList />
        </div>
        <div style={{ borderTop: "1px solid #ddd" }}>
          <MessageInput />
        </div>
      </div>
    </div>
  );
}
