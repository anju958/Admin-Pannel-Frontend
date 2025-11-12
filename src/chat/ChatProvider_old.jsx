// // // import React, { createContext, useContext, useEffect, useState } from "react";
// // // import { initSocket, getSocket } from "../socket";

// // // const ChatContext = createContext();

// // // export function ChatProvider({ children }) {

// // //   const [userId, setUserId] = useState(localStorage.getItem("chatUserId"));
// // //   const [role, setRole] = useState(localStorage.getItem("chatRole"));
// // //   const [messages, setMessages] = useState([]);
// // //   const [liveFeed, setLiveFeed] = useState([]);

// // //   useEffect(() => {
// // //     const uid = localStorage.getItem("chatUserId");
// // //     if (!uid) return;

// // //     const socket = initSocket(uid);

// // //     socket.on("receiveMessage", (msg) => {
// // //       setMessages((prev) => [...prev, msg]);

// // //       // Admin monitoring
// // //       if (localStorage.getItem("chatRole") === "superadmin") {
// // //         setLiveFeed((prev) => [...prev, msg]);
// // //       }
// // //     });

// // //     return () => socket.off("receiveMessage");
// // //   }, [userId]);

// // //   return (
// // //     <ChatContext.Provider value={{ userId, role, messages, liveFeed, socket: getSocket() }}>
// // //       {children}
// // //     </ChatContext.Provider>
// // //   );
// // // }

// // // export const useChat = () => useContext(ChatContext);


// // // src/chat/ChatProvider.jsx
// // import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
// // import { connectSocket, emitSocket, onSocket, offSocket } from "../socket";
// // import { fetchMessages, sendMessageREST, markAsReadAPI } from "../utils/api";

// // const ChatContext = createContext(null);
// // export const useChat = () => useContext(ChatContext);

// // // Utility: read current logged-in user from localStorage (admin/employee/client)
// // function readCurrentUser() {
// //   // You already save different items; unify here:
// //   const admin = localStorage.getItem("adminUser"); // if you save it like this
// //   const client = localStorage.getItem("clientUser");
// //   const employee = localStorage.getItem("user");
// //   if (admin) return JSON.parse(admin);   // { _id, role, official_email, ... }
// //   if (client) return JSON.parse(client); // { _id/email, ... }
// //   if (employee) return JSON.parse(employee);
// //   return null;
// // }

// // // role helper
// // function readRole() {
// //   const admin = localStorage.getItem("adminUser");
// //   if (admin) return JSON.parse(admin)?.role || "admin";
// //   const employee = localStorage.getItem("user");
// //   if (employee) return "employee";
// //   const client = localStorage.getItem("clientUser");
// //   if (client) return "client";
// //   return "guest";
// // }

// // export default function ChatProvider({ children }) {
// //   const [currentUser, setCurrentUser] = useState(readCurrentUser());
// //   const [role, setRole] = useState(readRole());
// //   const [online, setOnline] = useState(false);

// //   const [chatWith, setChatWith] = useState(null); // { _id, name, role }
// //   const [messages, setMessages] = useState([]);   // current thread
// //   const [unreads, setUnreads] = useState({});     // { userId: count }

// //   const socketReady = useRef(false);

// //   // Boot socket when user logs in
// //   useEffect(() => {
// //     if (!currentUser?._id) return;
// //     const s = connectSocket(currentUser._id);
// //     function onConnect() { setOnline(true); socketReady.current = true; }
// //     function onDisconnect() { setOnline(false); socketReady.current = false; }

// //     // incoming messages
// //     function onReceive(msg) {
// //       // if this is the open thread, append and mark read
// //       if (chatWith && (msg.senderId === chatWith._id || msg.receiverId === chatWith._id)) {
// //         setMessages(prev => [...prev, msg]);
// //       } else {
// //         // bump unread badge for that sender
// //         setUnreads(prev => ({ ...prev, [msg.senderId]: (prev[msg.senderId] || 0) + 1 }));
// //       }
// //     }

// //     s.on("connect", onConnect);
// //     s.on("disconnect", onDisconnect);
// //     onSocket("receiveMessage", onReceive);

// //     return () => {
// //       offSocket("receiveMessage", onReceive);
// //       s.off("connect", onConnect);
// //       s.off("disconnect", onDisconnect);
// //       // don't disconnect globally here; the app might still need socket
// //     };
// //     // eslint-disable-next-line react-hooks/exhaustive-deps
// //   }, [currentUser?._id, chatWith?._id]);

// //   // When we select someone, load history + clear unread
// //   useEffect(() => {
// //     async function bootThread() {
// //       if (!currentUser?._id || !chatWith?._id) return;
// //       const data = await fetchMessages(currentUser._id, chatWith._id);
// //       setMessages(data || []);
// //       // mark read
// //       await markAsReadAPI(currentUser._id, chatWith._id);
// //       setUnreads(prev => ({ ...prev, [chatWith._id]: 0 }));
// //     }
// //     bootThread();
// //   }, [chatWith?._id, currentUser?._id]);

// //   async function sendMessage(text) {
// //     if (!text?.trim() || !currentUser?._id || !chatWith?._id) return;

// //     const payload = {
// //       senderId: currentUser._id,
// //       receiverId: chatWith._id,
// //       message: text.trim(),
// //       timestamp: Date.now(),
// //     };

// //     // emit over socket (if connected) else REST fallback
// //     const emitted = emitSocket("sendMessage", payload);
// //     if (!emitted) {
// //       await sendMessageREST(payload);
// //     }

// //     setMessages(prev => [...prev, payload]); // optimistic UI
// //   }

// //   const value = useMemo(() => ({
// //     currentUser,
// //     role,
// //     online,
// //     chatWith, setChatWith,
// //     messages, setMessages,
// //     unreads,
// //     sendMessage,
// //   }), [currentUser, role, online, chatWith, messages, unreads]);

// //   return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
// // }

// import React, { createContext, useContext, useEffect, useState, useRef } from "react";
// import { io } from "socket.io-client";
// import axios from "axios";
// import { API_URL } from "../config";

// const ChatContext = createContext();

// export const ChatProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null); // logged-in user
//   const [users, setUsers] = useState([]); // chat list
//   const [messages, setMessages] = useState([]); // current chat messages
//   const [activeUser, setActiveUser] = useState(null); // selected chat user

//   const socket = useRef(null);

//   // ✅ Read logged-in user
//   useEffect(() => {
//     const admin = JSON.parse(localStorage.getItem("adminUser"));
//     const employee = JSON.parse(localStorage.getItem("user"));
//     const client = JSON.parse(localStorage.getItem("clientUser"));

//     if (admin) setCurrentUser({ id: admin.user?._id, role: admin.user?.role });
//     else if (employee) setCurrentUser({ id: employee.employeeId, role: "employee" });
//     else if (client) setCurrentUser({ id: client.id, role: "client" });
//   }, []);

//   // ✅ Initialize socket AFTER reading logged-in user
//   useEffect(() => {
//     if (!currentUser) return;

//     socket.current = io(API_URL, {
//       transports: ["websocket"],
//     });

//     socket.current.emit("join", currentUser.id);

//     socket.current.on("receiveMessage", (msg) => {
//       if (activeUser && msg.senderId === activeUser.id) {
//         setMessages((prev) => [...prev, msg]);
//       }
//     });

//     return () => socket.current.disconnect();
//   }, [currentUser, activeUser]);

//   // ✅ Fetch chat users based on role
//   const loadChatUsers = async () => {
//     if (!currentUser) return;
//     const res = await axios.get(`${API_URL}/api/chat/users?role=${currentUser.role}`);
//     setUsers(res.data.users);
//   };

//   // ✅ Load old messages
//   const loadMessages = async (peerId) => {
//     const res = await axios.get(
//       `${API_URL}/api/chat/messages?userId=${currentUser.id}&peerId=${peerId}`
//     );
//     setMessages(res.data.messages);
//   };

//   // ✅ Send message
//   const sendMessage = async (text) => {
//     if (!activeUser) return;

//     const messageData = {
//       senderId: currentUser.id,
//       receiverId: activeUser.id,
//       message: text,
//     };

//     socket.current.emit("sendMessage", messageData);
//     setMessages((prev) => [...prev, { ...messageData, createdAt: new Date() }]);

//     await axios.post(`${API_URL}/api/chat/send`, messageData);
//   };

//   return (
//     <ChatContext.Provider
//       value={{
//         users,
//         messages,
//         activeUser,
//         setActiveUser,
//         loadChatUsers,
//         loadMessages,
//         sendMessage,
//       }}
//     >
//       {children}
//     </ChatContext.Provider>
//   );
// };

// export const useChat = () => useContext(ChatContext);
