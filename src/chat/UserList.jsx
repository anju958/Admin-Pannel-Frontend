import React from "react";
import { useChat } from "./ChatContext";

export default function UserList() {
  const { users, openConversationWith } = useChat();

  if (!users || users.length === 0) {
    return (
      <div style={{ padding: 12, textAlign: "center" }}>No users found</div>
    );
  }

  return (
    <div style={{ overflowY: "auto", height: "100%" }}>
      {users.map((u) => (
        <div
          key={u._id}
          onClick={() => openConversationWith(u._id)}
          style={{
            display: "flex",
            alignItems: "center",
            padding: "10px 12px",
            cursor: "pointer",
            borderBottom: "1px solid #eee",
            background: "#fff",
          }}
        >
          <div
            style={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: u.isOnline ? "#22c55e" : "#9ca3af",
              marginRight: 8,
            }}
          ></div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{u.name}</div>
            <div style={{ fontSize: 12, color: "#666" }}>{u.role}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
