import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

const EmployeeNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user"));
  const employeeId = user?.employeeId; // Mongo _id

  useEffect(() => {
    if (!employeeId) return;

    loadNotifications().then(markAllRead);
  }, [employeeId]);

  const loadNotifications = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/notifications/employee/${employeeId}`
      );
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Load notifications error:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAllRead = async () => {
    try {
      await axios.put(
        `${API_URL}/api/notifications/employee/readAll/${employeeId}`
      );
    } catch (err) {
      console.error("Mark all read error:", err);
    }
  };

  if (loading) {
    return <p style={{ padding: "20px" }}>Loading notifications...</p>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Notifications</h2>

      {notifications.length === 0 && (
        <div style={styles.emptyBox}>
          <p style={styles.emptyText}>🎉 You have no new notifications</p>
        </div>
      )}

      {notifications.map(n => (
        <div
          key={n._id}
          style={{
            ...styles.card,
            backgroundColor: n.isRead ? "#f7f7f7" : "#eef4ff",
            borderLeft: n.isRead
              ? "4px solid #ccc"
              : "4px solid #2575FC",
          }}
        >
          <div style={styles.cardHeader}>
            <h4 style={styles.title}>{n.title}</h4>
            <span style={styles.time}>
              {new Date(n.createdAt).toLocaleString()}
            </span>
          </div>

          <p style={styles.body}>{n.body}</p>

          {!n.isRead && <span style={styles.unreadTag}>Unread</span>}
        </div>
      ))}
    </div>
  );
};

export default EmployeeNotifications;

/* ================= STYLES ================= */

const styles = {
  container: {
    padding: "24px",
    maxWidth: "900px",
  },
  heading: {
    marginBottom: "20px",
    fontSize: "26px",
    fontWeight: "600",
  },
  card: {
    padding: "16px",
    borderRadius: "10px",
    marginBottom: "14px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
    position: "relative",
  },
  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    margin: 0,
    fontSize: "18px",
  },
  body: {
    marginTop: "8px",
    fontSize: "15px",
    color: "#333",
  },
  time: {
    fontSize: "12px",
    color: "#777",
  },
  unreadTag: {
    position: "absolute",
    top: "12px",
    right: "12px",
    background: "#2575FC",
    color: "white",
    padding: "2px 8px",
    fontSize: "11px",
    borderRadius: "20px",
  },
  emptyBox: {
    padding: "40px",
    background: "#f9f9f9",
    borderRadius: "10px",
    textAlign: "center",
  },
  emptyText: {
    fontSize: "16px",
    color: "#777",
  },
};
