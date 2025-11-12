// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { API_URL } from "../config";

// export default function AdminAllChats() {
//   const [chats, setChats] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [grouped, setGrouped] = useState({});

//   // Load messages
//   useEffect(() => {
//     axios.get(`${API_URL}/api/chat/all`).then(res => {
//       setChats(res.data.chats || []);
//     });
//     // Get all users for name mapping
//     axios.get(`${API_URL}/api/chat/users?role=superadmin`).then(res => {
//       setUsers(res.data.users || []);
//     });
//   }, []);

//   // Group by room
//   useEffect(() => {
//     const byRoom = {};
//     chats.forEach(msg => {
//       const key = msg.roomKey || [msg.senderId, msg.receiverId].sort().join("|");
//       if (!byRoom[key]) byRoom[key] = [];
//       byRoom[key].push(msg);
//     });
//     setGrouped(byRoom);
//   }, [chats]);

//   const getUserName = (id) => users.find(u => String(u.id) === String(id))?.name || id;

//   return (
//     <div className="container py-3">
//       <h2>All Chat Logs (Super Admin View)</h2>
//       <div>
//         {Object.keys(grouped).length === 0 && <p>No chat records</p>}
//         {Object.entries(grouped).map(([key, msgs]) => (
//           <div key={key} style={{ border: "1px solid #ccc", borderRadius: 8, marginBottom: 22, padding: 12 }}>
//             <strong>
//               Chat: {getUserName(msgs[0].senderId)} ↔ {getUserName(msgs[0].receiverId)}
//             </strong>
//             <table style={{
//               width: "100%",
//               marginTop: 8,
//               borderCollapse: "collapse",
//               fontSize: 15
//             }}>
//               <thead>
//                 <tr>
//                   <th>Sender</th>
//                   <th>Receiver</th>
//                   <th>Message</th>
//                   <th>Time</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {msgs.map((m) => (
//                   <tr key={m._id}>
//                     <td>{getUserName(m.senderId)}</td>
//                     <td>{getUserName(m.receiverId)}</td>
//                     <td>{m.message}</td>
//                     <td>{new Date(m.timestamp).toLocaleString()}</td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

// src/chat/AdminAllChats.jsx
import React, { useState } from "react";
import UserList from "./UserList";
import ChatBox from "./ChatBox";

export default function AdminAllChats() {
  const [activeUser, setActiveUser] = useState(null);

  return (
    <div style={{ display: "flex", height: "80vh", background: "#fff" }}>
      <div style={{ width: 320, borderRight: "1px solid #eee" }}>
        <UserList onSelectUser={(u) => setActiveUser(u)} />
      </div>
      <div style={{ flex: 1 }}>
        <ChatBox peerId={activeUser?._id} peerName={activeUser?.name} />
      </div>
    </div>
  );
}
