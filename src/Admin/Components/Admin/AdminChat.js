// src/Admin/AdminChat.js

import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:YOUR_SERVER_PORT"; // Change to your backend server

function AdminChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef();

  useEffect(() => {
    socketRef.current = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    socketRef.current.emit("join", "superadmin");
    socketRef.current.on("receiveMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (input.trim() === "") return;
    const messageData = {
      senderId: "superadmin",
      receiverId: "employee1", // Replace or select dynamically
      message: input,
      timestamp: Date.now()
    };
    socketRef.current.emit("sendMessage", messageData);
    setMessages((prev) => [...prev, messageData]);
    setInput("");
  };

  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: 8,
      background: "#fff",
      padding: "18px",
      maxWidth: 400,
      height: 450,
      display: "flex",
      flexDirection: "column",
      margin: "0 auto"
    }}>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 10 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <b>{msg.senderId}</b>: {msg.message}<br/>
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div style={{ display: "flex" }}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #aaa" }}
        />
        <button
          onClick={sendMessage}
          style={{ padding: "6px 18px", borderRadius: 6, marginLeft: 8, background: "#6b46c1", color: "#fff", border: "none" }}>
          Send
        </button>
      </div>
    </div>
  );
}

export default AdminChat;
