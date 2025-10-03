
import React from 'react';
import { FaUserCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';


function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <nav className="custom-navbar">
      <div className="navbar-left">
       
      </div>
      <div className="navbar-right dropdown">
        <button
          className="btn btn-light dropdown-toggle d-flex align-items-center"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <FaUserCircle size={24} className="me-2" />
          <span>{user?.ename || "Employee"}</span>
        </button>
        <ul className="dropdown-menu dropdown-menu-end shadow">
          <li>
            <Button
              onClick={handleLogout}
              className="dropdown-item text-danger"
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
