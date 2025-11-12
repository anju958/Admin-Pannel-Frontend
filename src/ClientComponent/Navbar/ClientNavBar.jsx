import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
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
    <nav style={{
      background: "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 70%, #2575FC 100%)",
      minHeight: "70px",
      display: "flex",
      alignItems: "center",
      position: "relative",
      fontFamily: "inherit"
    }}>
      <div style={{ flex: 1, textAlign: "center" }}>
        <span style={{
          fontWeight: "bold",
          fontSize: "2.3rem",
          color: "white",
          letterSpacing: "2px"
        }}>
          Premier WebTech
        </span>
      </div>
      <div style={{ position: "absolute", right: "2vw", top: "50%", transform: "translateY(-50%)" }}>
        <div className="dropdown">
          <button className="btn btn-primary dropdown-toggle d-flex align-items-center px-3 fw-bold"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
            style={{ fontSize: "1.09rem", minWidth: 120 }}>
            <FaUserCircle size={28} className="me-2" />
            <span>{client?.leadName || "Client"}</span>
          </button>
          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <li>
              <Button onClick={handleLogout}
                className="dropdown-item text-danger fw-bold"
                component="span">
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default ClientNavBar;
