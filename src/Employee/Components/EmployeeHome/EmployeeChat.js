import React, { useEffect, useState, useRef } from 'react';
import { io } from "socket.io-client";
import axios from "axios";
import { API_URL } from "../../../config";

const SOCKET_SERVER_URL = "http://localhost:YOUR_BACKEND_PORT"; // Change as needed

function EmployeeChat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [receiverId, setReceiverId] = useState(""); // Track who you're messaging
  const [employees, setEmployees] = useState([]);
  const socketRef = useRef();

  // Get logged-in employee info
  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user?._id || "";

  useEffect(() => {
    // Fetch employees for dropdown (except logged-in one)
    axios.get(`${API_URL}/api/getemployeeData`).then(res => {
      setEmployees(res.data.filter(e => e._id !== employeeId));
    });
  }, [employeeId]);

  useEffect(() => {
    if (!employeeId) return;
    socketRef.current = io(SOCKET_SERVER_URL, { transports: ['websocket'] });
    socketRef.current.emit("join", employeeId);
    socketRef.current.on("receiveMessage", (message) => {
      // Show messages relevant to the current employee
      if (
        message.senderId === employeeId ||
        message.receiverId === employeeId
      ) {
        setMessages(prev => [...prev, message]);
      }
    });
    return () => {
      socketRef.current.disconnect();
    };
  }, [employeeId]);

  const sendMessage = () => {
    if (input.trim() === "" || receiverId === "") return;
    const messageData = {
      senderId: employeeId,
      receiverId: receiverId, // can be another employee or "superadmin"/"admin"
      message: input,
      timestamp: Date.now()
    };
    socketRef.current.emit("sendMessage", messageData);
    setMessages(prev => [...prev, messageData]);
    setInput("");
  };

  return (
    <div style={{
      display: "flex", flexDirection: "column", height: "420px"
    }}>
      <div style={{ marginBottom: 8 }}>
        <select
          value={receiverId}
          onChange={e => setReceiverId(e.target.value)}
          style={{ width: "100%", padding: "6px", marginBottom: "6px", borderRadius: "4px", border: "1px solid #aaa" }}
        >
          <option value="">-- Select recipient --</option>
          <option value="superadmin">Admin</option>
          {employees.map(emp => (
            <option key={emp._id} value={emp._id}>{emp.ename}</option>
          ))}
        </select>
      </div>
      <div style={{ flex: 1, overflowY: "auto", marginBottom: 8 }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: 10 }}>
            <b>{msg.senderId === employeeId ? "You" : (msg.senderId === "superadmin" ? "Admin" : "Employee")}</b>: {msg.message}<br />
            <small>{new Date(msg.timestamp).toLocaleString()}</small>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "center", padding: "8px 0" }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your message"
          style={{ flex: 1, padding: 8, borderRadius: 6, border: "1px solid #aaa", marginRight: 8 }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: "8px 18px",
            borderRadius: 6,
            background: "#6b46c1",
            color: "#fff",
            border: "none",
            fontWeight: 500,
            cursor: "pointer"
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
}

export default EmployeeChat;
