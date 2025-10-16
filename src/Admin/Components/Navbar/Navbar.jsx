import React from "react";
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
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
      {/* Brand / Centered */}
      <div className="container-fluid d-flex align-items-center justify-content-between">

        {/* Sidebar Brand (optional, can be removed if only Premier Admin is center) */}
        {/* <span className="navbar-brand fw-bold text-white fs-3" style={{ letterSpacing: "1px" }}>
          Admin Dashboard
        </span> */}

        <div className="mx-auto text-center" style={{ flex: 1 }}>
          <span
            className="fw-bold text-white"
            style={{ fontSize: "2rem", letterSpacing: "1px", fontFamily: "inherit" }}
          >
            Premier Admin
          </span>
        </div>

        {/* Profile and Actions (far right) */}
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
              <span>{user?.ename || "Admin"}</span>
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
