import React, { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { AuthContext } from "../../../Context/AuthContext";
import UniversalNotificationBell from "../Common/UniversalNotificationBell";

function formatRole(role) {
  if (!role) return "";
  switch (role) {
    case "superadmin":
      return "Super Admin";
    case "manager":
      return "Manager";
    case "admin":
      return "Admin";
    case "hr":
      return "HR";
    case "accountant":
      return "Accountant";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (typeof logout === "function") logout();
    navigate("/");
  };

  return (
    <nav
      className="navbar px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 50%, #2575FC 100%)",
        minHeight: "70px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container-fluid d-flex align-items-center">
        {/* LEFT SPACE (for sidebar width balance) */}
        <div style={{ width: "250px" }} className="d-none d-lg-block" />

        {/* CENTER TITLE */}
        <div className="flex-grow-1 text-center">
          <span
            className="fw-bold text-white"
            style={{ fontSize: "1.8rem", letterSpacing: "1px" }}
          >
            Premier Admin
          </span>
        </div>

        {/* RIGHT SIDE */}
        <div className="d-flex align-items-center gap-3">
          {/* 🔔 UNIVERSAL NOTIFICATION BELL */}
          <UniversalNotificationBell />

          {/* 👤 USER DROPDOWN */}
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center px-3 fw-bold"
              data-bs-toggle="dropdown"
            >
              <FaUserCircle size={26} className="me-2 text-primary" />
              <span className="d-none d-sm-inline">{formatRole(user?.role)}</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
              <li className="dropdown-header border-bottom mb-1">
                {user?.name || user?.email}
              </li>
              <li>
                <Button
                  onClick={handleLogout}
                  className="dropdown-item text-danger fw-bold"
                  component="span"
                >
                  Logout
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
