import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import { useAuth } from "../Context/AuthContext";

const ChatContext = createContext();
export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }) => {
  const { user } = useAuth();
  const token = localStorage.getItem("token");

  const socketBase = process.env.REACT_APP_SOCKET_URL || "http://localhost:5000";
  const apiBase = process.env.REACT_APP_API_URL || "http://localhost:5000";

  const [socket, setSocket] = useState(null);
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState({});
  const [typing, setTyping] = useState({});
  const [unread, setUnread] = useState({});
  const [connected, setConnected] = useState(false);

  const audio = useRef(new Audio("/message-tone.mp3"));

  useEffect(() => {
    if (!user || !token) return;

    const s = io(socketBase, {
      auth: { token },
      transports: ["websocket"],
    });

    s.on("connect", () => {
      setConnected(true);
      s.emit("register", token);
    });

    s.on("disconnect", () => setConnected(false));

    s.on("message:new", (msg) => {
      const key = makeKey(msg.senderId, msg.receiverId);
      setMessages((prev) => ({
        ...prev,
        [key]: [...(prev[key] || []), msg],
      }));

      if (msg.receiverId === user._id) {
        setUnread((prev) => ({
          ...prev,
          [msg.senderId]: (prev[msg.senderId] || 0) + 1,
        }));
        audio.current.play().catch(() => {});
      }
    });

    s.on("presence:update", ({ userId, isOnline }) => {
      setUsers((prev) =>
        prev.map((u) =>
          String(u._id) === String(userId) ? { ...u, isOnline } : u
        )
      );
    });

    s.on("typing:start", (peerId) =>
      setTyping((prev) => ({ ...prev, [peerId]: true }))
    );
    s.on("typing:stop", (peerId) =>
      setTyping((prev) => ({ ...prev, [peerId]: false }))
    );

    setSocket(s);
    return () => s.disconnect();
  }, [user, token]);

  useEffect(() => {
    if (!user || !token) return;
    axios
      .get(`${apiBase}/api/chat/users`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setUsers(res.data.users || []))
      .catch(() => setUsers([]));
  }, [user, token]);

  const makeKey = (a, b) => (String(a) < String(b) ? `${a}|${b}` : `${b}|${a}`);

  const sendMessage = (peerId, text) => {
    if (socket && text) socket.emit("send_message", { receiverId: peerId, message: text });
  };

  const startTyping = (peerId) => socket?.emit("typing:start", peerId);
  const stopTyping = (peerId) => socket?.emit("typing:stop", peerId);

  return (
    <ChatContext.Provider
      value={{
        socket,
        connected,
        users,
        messages,
        typing,
        unread,
        sendMessage,
        startTyping,
        stopTyping,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
