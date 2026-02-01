import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaBell } from "react-icons/fa";
import { API_URL } from "../../../config";
import { getSocket } from "../../../socket";

const UniversalNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const token = localStorage.getItem("token");

  const fetchNotifications = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/notifications-all/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Error fetching notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const socket = getSocket();
    if (socket) {
      socket.on("new-notification", (data) => {
        setNotifications((prev) => [data, ...prev]);
      });
    }

    return () => {
      if (socket) socket.off("new-notification");
    };
  }, []);

  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${API_URL}/api/notifications-all/read/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, isRead: true } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(
        `${API_URL}/api/notifications-all/read-all`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  return (
    <div className="dropdown">
      <button
        className="btn btn-light position-relative"
        onClick={() => setIsOpen(!isOpen)}
        data-bs-toggle="dropdown"
      >
        <FaBell size={20} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge bg-danger rounded-pill">
            {unreadCount}
          </span>
        )}
      </button>

      <ul
        className="dropdown-menu dropdown-menu-end shadow-lg"
        style={{ width: "350px", maxHeight: "450px", overflowY: "auto" }}
      >
        <li className="dropdown-header d-flex justify-content-between align-items-center p-3">
          <h6 className="m-0">Notifications</h6>
          {unreadCount > 0 && (
            <button
              className="btn btn-sm btn-link text-primary p-0"
              onClick={markAllAsRead}
            >
              Mark all as read
            </button>
          )}
        </li>
        <li><hr className="dropdown-divider" /></li>
        {notifications.length === 0 ? (
          <li className="dropdown-item text-center py-3 text-muted">
            No notifications
          </li>
        ) : (
          notifications.map((n) => (
            <li
              key={n._id}
              className={`dropdown-item p-3 ${!n.isRead ? "bg-light fw-bold" : ""}`}
              style={{ whiteSpace: "normal", cursor: "pointer", borderBottom: "1px solid #f1f1f1" }}
              onClick={() => markAsRead(n._id)}
            >
              <div className="d-flex justify-content-between">
                <span className="text-primary small">{n.title}</span>
                <small className="text-muted">
                  {new Date(n.createdAt).toLocaleDateString()}
                </small>
              </div>
              <div className="mt-1 small text-dark">{n.message}</div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default UniversalNotificationBell;
