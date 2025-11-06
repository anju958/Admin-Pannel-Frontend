import React, { useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import { AuthContext } from "../../../Context/AuthContext";

// Optional function to capitalize role for display
function formatRole(role) {
  if (!role) return "";
  switch (role) {
    case "superadmin":
      return "Super Admin";
    case "admin":
      return "Admin";
    case "hr":
      return "HR";
    case "account":
      return "Account";
    default:
      return role.charAt(0).toUpperCase() + role.slice(1);
  }
}

function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    if (typeof logout === "function") logout();
    navigate("/");
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 50%, #2575FC 100%)",
        color: "white",
        borderBottom: "2px solid #e0e0e0",
        minHeight: "70px"
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="mx-auto text-center" style={{ flex: 1 }}>
          <span
            className="fw-bold text-white"
            style={{ fontSize: "2rem", letterSpacing: "1px", fontFamily: "inherit" }}
          >
            Premier Admin
          </span>
        </div>
        <div className="d-flex align-items-center gap-3">
          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center px-3 fw-bold"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{ fontSize: "1.12rem" }}
            >
              <FaUserCircle size={30} className="me-2 text-primary" />
              <span>
                {formatRole(user?.role)}
              </span>
            </button>
            <ul className="dropdown-menu dropdown-menu-end shadow-sm">
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
