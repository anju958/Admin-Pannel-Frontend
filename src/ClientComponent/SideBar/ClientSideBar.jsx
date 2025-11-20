import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaHome, FaTasks, FaUserCircle, FaFolderOpen, FaFileAlt } from 'react-icons/fa';

function ClientSideBar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const menuItems = [
    { label: "Home", path: "/client", icon: <FaHome /> },
    { label: "Projects", path: "/client/projects", icon: <FaFolderOpen /> },
    { label: "Proposals", path: "/client/proposals", icon: <FaFileAlt /> },
    { label: "Task", path: "/client/tasks", icon: <FaTasks /> },
    { label: "Profile", path: "/client/profile", icon: <FaUserCircle /> },
  ];

  return (
    <div
      className="client-sidebar"
      style={{
        background: "linear-gradient(180deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
        minHeight: "100vh",
        color: "white",
        padding: "0 20px",
        fontFamily: "inherit",
        width: "250px",
        boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        position: "fixed",
        left: 0,
        top: 0,
      }}
    >
      {/* SIDEBAR TITLE */}
      <div className="pt-4 pb-3">
        <h2
          style={{
            fontWeight: 900,
            fontSize: "2rem",
            letterSpacing: "2px",
            marginBottom: 0,
          }}
        >
          Dashboard
        </h2>
      </div>

      {/* MENU */}
      <ul className="list-unstyled mt-4" style={{ fontSize: "1.07rem" }}>
        {menuItems.map((item) => (
          <li
            key={item.path}
            className="mb-2"
            style={{
              background:
                currentPath === item.path
                  ? "rgba(255,255,255,0.18)"
                  : "transparent",
              borderRadius: "10px",
              transition: "0.2s",
            }}
          >
            <Link
              to={item.path}
              style={{
                color: "white",
                display: "flex",
                alignItems: "center",
                fontWeight: 600,
                gap: "14px",
                padding: "12px 14px",
                borderRadius: "10px",
              }}
              className="client-sidebar-link"
            >
              <span style={{ fontSize: "1.3rem" }}>{item.icon}</span>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ClientSideBar;
