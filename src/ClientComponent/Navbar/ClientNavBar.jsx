import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';

function ClientNavBar() {
  const client = JSON.parse(localStorage.getItem("clientUser"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("clientToken");
    localStorage.removeItem("clientUser");
    navigate("/client/ClientPage");
  };

  return (
    <nav
      style={{
        background: "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 60%, #2575FC 100%)",
        height: "75px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 30px",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0px 4px 12px rgba(0,0,0,0.15)"
      }}
    >

      {/* BRAND LOGO / TITLE */}
      <div>
        <span
          style={{
            fontWeight: "800",
            fontSize: "2rem",
            color: "white",
            letterSpacing: "2px"
          }}
        >
          Premier WebTech
        </span>
      </div>

      {/* PROFILE DROPDOWN */}
      <div>
        <div className="dropdown">
          <button
            className="btn dropdown-toggle d-flex align-items-center px-3 fw-bold"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{
              background: "#ffffff",
              color: "#333",
              fontSize: "1.05rem",
              borderRadius: "10px",
              border: "none",
              padding: "10px 18px",
              boxShadow: "0px 4px 10px rgba(0,0,0,0.12)"
            }}
          >
            <FaUserCircle size={28} className="me-2 text-primary" />
            <span>{client?.leadName || "Client"}</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow">
            <li>
              <button
                onClick={handleLogout}
                className="dropdown-item text-danger fw-bold"
                style={{ fontSize: "1rem" }}
              >
                Logout
              </button>
            </li>
          </ul>
        </div>
      </div>

    </nav>
  );
}

export default ClientNavBar;
