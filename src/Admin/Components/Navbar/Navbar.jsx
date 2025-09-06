import React from 'react'
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';

function Navbar() {
    const user = JSON.parse(localStorage.getItem("user")); 
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); 
    localStorage.removeItem("user");
    navigate("/");
  };

    return (
        <nav className="navbar  bg-success p-3 text-dark bg-opacity-25 px-3">
            <span className="navbar-brand">
                <form className="d-flex" role="search">
                    <input
                        className="form-control me-2 searchBar"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="submit">
                        Search
                    </button>
                </form>
            </span>
            
            <div className="ms-auto dropdown">
          <button
            className="btn btn-dark dropdown-toggle d-flex align-items-center"
            type="button"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <FaUserCircle size={28} className="me-2" />
            <span>{user?.ename || "Admin"} </span>
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
    )
}

export default Navbar
