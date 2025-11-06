import React, { useState, useEffect } from 'react';
import { FaUserCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  
  const [loginTime, setLoginTime] = useState(null);
  const [workingHours, setWorkingHours] = useState('0:00:00');
  const [currentTime, setCurrentTime] = useState(new Date());

  // Fetch login time (check-in) from backend
  useEffect(() => {
    const fetchLoginTime = async () => {
      if (!user?._id) return;

      try {
        const today = new Date().toISOString().split('T')[0];
        const response = await axios.get(`${API_URL}/api/employee/working-hours`, {
          params: {
            employeeId: user._id,
            date: today
          }
        });

        if (response.data?.check_in) {
          setLoginTime(response.data.check_in);
        }
      } catch (err) {
        console.error('Error fetching login time:', err);
      }
    };

    fetchLoginTime();
  }, [user?._id]);

  // Update working hours in real-time
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      if (loginTime) {
        // Parse login time (format: HH:MM:SS)
        const [hours, minutes, seconds] = loginTime.split(':').map(Number);
        const loginDateTime = new Date();
        loginDateTime.setHours(hours, minutes, seconds, 0);

        // Calculate time difference
        const timeDiff = currentTime - loginDateTime;
        const totalSeconds = Math.floor(timeDiff / 1000);

        const hrs = Math.floor(totalSeconds / 3600);
        const mins = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        setWorkingHours(`${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime, currentTime]);

  // Format current time for display
  const formatCurrentTime = () => {
    return currentTime.toLocaleTimeString('en-IN', { hour12: false });
  };

  const handleLogout = async () => {
    try {
      // Call logout API to mark check-out
      if (user?.employeeId) {
        await axios.post(`${API_URL}/api/employee/logout`, {
          employeeId: user.employeeId
        });
      }
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 50%, #2575FC 100%)",
        color: "white",
        borderBottom: "2px solid #e0e0e0",
        minHeight: "65px"
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="mx-auto text-center" style={{ flex: 1 }}>
          <span
            className="fw-bold text-white"
            style={{ fontSize: "2rem", letterSpacing: "1px", fontFamily: "inherit" }}
          >
            Employee Dashboard
          </span>
        </div>

        {/* Time Info Section */}
        <div className="d-flex align-items-center gap-4 me-4">
          <div className="text-white text-center">
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Current Time</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {formatCurrentTime()}
            </div>
          </div>

          <div style={{ borderLeft: "2px solid rgba(255,255,255,0.3)", height: "40px" }}></div>

          <div className="text-white text-center">
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Login Time</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {loginTime || "Loading..."}
            </div>
          </div>

          <div style={{ borderLeft: "2px solid rgba(255,255,255,0.3)", height: "40px" }}></div>

          <div className="text-white text-center">
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>Working Hours</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#FFD700" }}>
              {workingHours}
            </div>
          </div>
        </div>

        {/* User Profile Dropdown */}
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
              <span>{user?.ename || "Employee"}</span>
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
