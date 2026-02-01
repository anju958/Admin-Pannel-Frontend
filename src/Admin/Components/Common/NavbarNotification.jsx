import React, { useEffect, useState } from "react";
import axios from "axios";
import Badge from "@mui/material/Badge";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { API_URL } from "../../../config";
import { getSocket } from "../../../socket";

const NavbarNotification = () => {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // 🔴 unread notification count
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  /* ============================
     1️⃣ LOAD OLD NOTIFICATIONS
  ============================ */
  const loadNotifications = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/notifications/admin`
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Failed to load notifications", err);
    }
  };

  /* ============================
     2️⃣ MARK AS READ
  ============================ */
  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/mark-read/${id}`
      );

      setNotifications((prev) =>
        prev.map((n) =>
          n._id === id ? { ...n, isRead: true } : n
        )
      );
    } catch (err) {
      console.error("Failed to mark read", err);
    }
  };

  /* ============================
     3️⃣ SOCKET LISTENER
  ============================ */
  useEffect(() => {
    loadNotifications();

    const socket = getSocket();
    if (!socket) return;

    socket.on("new-notification", (data) => {
      setNotifications((prev) => [data, ...prev]);
    });

    return () => {
      socket.off("new-notification");
    };
  }, []);

  return (
    <div style={{ position: "relative" }}>
      {/* 🔔 Notification Bell */}
      <Badge badgeContent={unreadCount} color="error">
        <NotificationsIcon
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
        />
      </Badge>

      {/* 📥 Dropdown */}
      {open && (
        <div
          style={{
            position: "absolute",
            right: 0,
            top: "45px",
            width: "320px",
            maxHeight: "400px",
            overflowY: "auto",
            background: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
            borderRadius: "6px",
            zIndex: 1000,
          }}
        >
          {notifications.length === 0 ? (
            <p style={{ padding: "10px" }}>
              No notifications
            </p>
          ) : (
            notifications.map((n) => (
              <div
                key={n._id}
                onClick={() => markAsRead(n._id)}
                style={{
                  padding: "10px",
                  cursor: "pointer",
                  background: n.isRead
                    ? "#fff"
                    : "#eef4ff",
                  borderBottom: "1px solid #eee",
                }}
              >
                <strong>{n.title}</strong>
                <p style={{ margin: "4px 0", fontSize: "14px" }}>
                  {n.message}
                </p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default NavbarNotification;
