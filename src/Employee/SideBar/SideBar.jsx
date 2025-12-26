import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { NavLink } from "react-router-dom";
import {
  FaHome,
  FaUserCheck,
  FaUmbrellaBeach,
  FaMoneyBill,
  FaTasks,
  FaChartLine,
  FaUserCircle,
} from "react-icons/fa";
import axios from "axios";
import { API_URL } from "../../config";

function SideBar() {
  // 🔔 notification badge state
  const [unreadCount, setUnreadCount] = useState(0);

  const routerLocation = useLocation();

  // ✅ correct localStorage usage
 const user = JSON.parse(localStorage.getItem("user"));
const employeeId = user?.employeeId;

  // 🔹 Fetch unread count (FIXED)
 

  // 🔹 Load badge on sidebar load
  useEffect(() => {
    fetchUnreadCount();
  }, [employeeId]);

  // 🔹 Auto refresh unread count every 30s
  useEffect(() => {
    const interval = setInterval(fetchUnreadCount, 30000);
    return () => clearInterval(interval);
  }, [employeeId]);

  // ❌ REMOVE manual reset logic (backend handles it)
  // This avoids bugs and mismatch
const fetchUnreadCount = async () => {
  if (!employeeId) return;

  const res = await axios.get(
    `${API_URL}/api/notifications/employee/unread/${employeeId}`
  );

  if (res.data.success) {
    setUnreadCount(res.data.unread);
  }
};

useEffect(() => {
  fetchUnreadCount();
  const interval = setInterval(fetchUnreadCount, 30000);
  return () => clearInterval(interval);
}, [employeeId]);


  return (
    <div
      className="sidebar-container"
      style={{
        background:
          "linear-gradient(180deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
        minHeight: "100vh",
        color: "white",
        padding: "0 16px",
      }}
    >
      <h4 className="sidebar-title pt-3 fw-bold" style={{ letterSpacing: "1px" }}>
        Employee Dashboard
      </h4>

      <ul className="sidebar-menu list-unstyled mt-4">
        <li>
          <Link to="">
            <FaHome className="sidebar-icon" /> Home
          </Link>
        </li>

        <li>
          <Link to="/employee/employeeattendance">
            <FaUserCheck className="sidebar-icon" /> Attendance
          </Link>
        </li>

        <li>
          <Link to="/employee/LeavePage">
            <FaUmbrellaBeach className="sidebar-icon" /> Leaves
          </Link>
        </li>

        <li>
          <Link to="/employee/salaryPage">
            <FaMoneyBill className="sidebar-icon" /> Salary
          </Link>
        </li>

        <li>
          <Link to="/employee/employeeTask">
            <FaTasks className="sidebar-icon" /> Task
          </Link>
        </li>

        {/* 🔔 Notifications */}
        <li className="notification-item">
          <NavLink
            to="/employee/employeeNotification"
            className={({ isActive }) =>
              isActive ? "sidebar-link active" : "sidebar-link"
            }
          >
            Notifications
            {unreadCount > 0 && (
              <span className="badge ms-2">{unreadCount}</span>
            )}
          </NavLink>
        </li>


        <li>
          <Link to="/employee/performance">
            <FaChartLine className="sidebar-icon" /> Performance
          </Link>
        </li>

        <li>
          <Link to="/employee/profile">
            <FaUserCircle className="sidebar-icon" /> Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;
