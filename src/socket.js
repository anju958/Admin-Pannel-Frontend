import { io } from "socket.io-client";

let socket = null;

/**
 * initSocket - initializes and returns singleton socket instance
 * @param {string} token - JWT token
 * @param {string} url - socket server url (REACT_APP_SOCKET_URL)
 */
export function initSocket(token, url) {
  if (socket) return socket;
  if (!url) url = process.env.REACT_APP_SOCKET_URL || process.env.REACT_APP_API_URL;
  socket = io(url, {
    auth: { token },
    transports: ["websocket", "polling"],
    autoConnect: true,
  });

  socket.on("connect_error", (err) => {
    console.error("Socket connect_error", err.message || err);
  });

  return socket;
}

export function getSocket() {
  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
