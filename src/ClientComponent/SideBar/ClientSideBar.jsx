import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaTasks, FaUserCircle, FaFolder, FaUserGraduate } from 'react-icons/fa';

function ClientSideBar() {
  // Example for handling submenu expand/collapse
  const [employeeMenuOpen, setEmployeeMenuOpen] = useState(false);

  return (
    <div className="sidebar-container" style={{
      background: "linear-gradient(180deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
      minHeight: "100vh",
      color: "white",
      padding: "0 20px",
      fontFamily: "inherit"
    }}>
      <div className="pt-4 pb-3">
        <h2 style={{
          fontWeight: 900,
          fontSize: "2rem",
          letterSpacing: "2px",
          marginBottom: 0
        }}>
           Dashboard
        </h2>
      </div>
      <ul className="sidebar-menu list-unstyled mt-4" style={{ fontSize: "1.07rem" }}>
        <li className="mb-2">
          <Link to="/client" style={{ color: "white", display: "flex", alignItems: "center", fontWeight: 600, gap: "13px" }}>
            <FaHome className="sidebar-icon" /> Home
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/client/projects" style={{ color: "white", display: "flex", alignItems: "center", fontWeight: 600, gap: "13px" }}>
            <FaTasks className="sidebar-icon" /> Projects
          </Link>
        </li>
        <li className="mb-2">
          <Link to="/client/profile" style={{ color: "white", display: "flex", alignItems: "center", fontWeight: 600, gap: "13px" }}>
            <FaUserCircle className="sidebar-icon" /> Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default ClientSideBar;