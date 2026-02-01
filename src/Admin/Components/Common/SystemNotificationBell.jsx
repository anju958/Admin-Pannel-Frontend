import React, { useEffect, useState } from "react";
import { FaBell } from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../../config";
import { getSocket } from "../../../socket";

const SystemNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // load old system notifications
    axios
      .get(`${API_URL}/api/notifications/admin`)
      .then(res => setNotifications(res.data.notifications || []));

    // listen for new system notifications
    const socket = getSocket();
    if (!socket) return;

    socket.on("new-notification", (data) => {
      setNotifications(prev => [data, ...prev]);
    });

    return () => socket.off("new-notification");
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <div className="dropdown">
      <button
        className="btn btn-light position-relative"
        data-bs-toggle="dropdown"
      >
        <FaBell size={18} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge bg-danger">
            {unreadCount}
          </span>
        )}
      </button>

      <ul className="dropdown-menu dropdown-menu-end">
        {notifications.map(n => (
          <li key={n._id} className="dropdown-item">
            <strong>{n.title}</strong>
            <div className="text-muted small">{n.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SystemNotificationBell;
