

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
      className="navbar navbar-expand-lg px-3 py-2 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #1A2A6C, #6A11CB, #2575FC)", // logo gradient
        color: "white",
      }}
    >
      {/* Brand / Logo */}
      <a className="navbar-brand fw-bold text-white" href="#">
        Premier Admin
      </a>

      {/* Search Bar */}
      <form className="d-flex ms-3 flex-grow-1" role="search">
        <input
          className="form-control me-2"
          type="search"
          placeholder="Search..."
          aria-label="Search"
        />
        <Button
          variant="contained"
          size="small"
          style={{
            backgroundColor: "#0b2c5d",
            color: "white",
            fontWeight: "bold",
          }}
        >
          Search
        </Button>
      </form>

      {/* User Profile Dropdown */}
      <div className="ms-auto dropdown">
        <button
          className="btn btn-light dropdown-toggle d-flex align-items-center px-3 fw-bold"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <FaUserCircle size={26} className="me-2 text-primary" />
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
    </nav>
  );
}

export default Navbar;
