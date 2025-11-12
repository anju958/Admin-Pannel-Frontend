// import { io } from "socket.io-client";

// let socket = null;

// export function initSocket(token, url) {
//   if (socket) return socket;
//   if (!url) url = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL || "http://localhost:5000";

//   socket = io(url, {
//     auth: { token },
//     transports: ["websocket"],
//     reconnectionAttempts: 5,
//     autoConnect: true,
//   });

//   socket.on("connect", () => {
//     console.log("✅ Connected to socket server:", socket.id);
//   });

//   socket.on("connect_error", (err) => {
//     console.warn("⚠️ Socket connect_error:", err.message || err);
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ Disconnected from socket server");
//   });

//   return socket;
// }

// export function getSocket() {
//   return socket;
// }

// export function disconnectSocket() {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// }
import { io } from "socket.io-client";

let socket = null;

export function initSocket(token, url) {
  if (socket && socket.connected) return socket; // ✅ prevent re-creation
  if (!url) url = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";

  socket = io(url, {
    auth: { token },
    transports: ["websocket"],
    reconnection: true,
    reconnectionAttempts: 5,
  });

  socket.on("connect_error", (err) => {
    console.warn("⚠️ Socket connect error:", err.message);
  });

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
