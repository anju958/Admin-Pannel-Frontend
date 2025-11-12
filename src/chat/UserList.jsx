// import React from "react";
// import { useChat } from "./ChatContext";
// // import "./chat.css"; // make sure this file is imported for styling

// export default function UserList({ onSelectUser }) {
//   const { users, openConversationWith, socketReady } = useChat();

//   const handleClick = (user) => {
//     if (onSelectUser) onSelectUser(user);
//     openConversationWith(user._id);
//   };

//   // 🔹 Loading state
//   if (!socketReady && users.length === 0) {
//     return (
//       <div className="user-list-loading">
//         <div className="loader" />
//         <span>Connecting to chat...</span>
//       </div>
//     );
//   }

//   // 🔹 No users found
//   if (users.length === 0) {
//     return (
//       <div className="user-list-empty">
//         <span>No users available</span>
//       </div>
//     );
//   }

//   return (
//     <div className="user-list-container">
//       <ul className="user-list">
//         {users.map((u) => (
//           <li
//             key={u._id}
//             className="user-list-item"
//             onClick={() => handleClick(u)}
//           >
//             {/* Online/offline dot */}
//             <span
//               className={`status-dot ${u.isOnline ? "online" : "offline"}`}
//               title={u.isOnline ? "Online" : "Offline"}
//             />

//             {/* User name + role */}
//             <div className="user-list-info">
//               <div className="user-name">{u.name || "Unnamed"}</div>
//               <div className="user-role">{u.role}</div>
//             </div>

//             {/* Unread badge */}
//             {u.unread > 0 && <div className="unread-badge">{u.unread}</div>}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

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
