// import { io } from "socket.io-client";

// // Connect to your backend Socket.IO server
// export const socket = io("http://localhost:5000", {
//   transports: ["websocket"],
//   reconnection: true,
//   reconnectionAttempts: 5,
//   reconnectionDelay: 1000,
// });

import { io } from "socket.io-client";

// Connect to your backend Socket.IO server
export const socket = io("http://localhost:5000", {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
