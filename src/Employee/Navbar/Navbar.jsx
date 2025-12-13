import React, { useState, useEffect, useRef } from 'react';
import { FaUserCircle } from "react-icons/fa";
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../config';

function Navbar() {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const employeeId = user?._id;

  /* ---------------------- HOLIDAY STATES ---------------------- */
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayTitle, setHolidayTitle] = useState("");

  /* ---------------------- WORKING TIME STATES ---------------------- */
  const [loginTime, setLoginTime] = useState(localStorage.getItem("loginTime"));
  const [officeStart, setOfficeStart] = useState(localStorage.getItem("officeStart"));
  const [officeEnd, setOfficeEnd] = useState(localStorage.getItem("officeEnd"));
  const [dailyWorkingHours, setDailyWorkingHours] = useState(Number(localStorage.getItem("dailyWorkingHours") || 9));

  const [workingHours, setWorkingHours] = useState("00:00:00");
  const [currentTime, setCurrentTime] = useState(new Date());

  /* -----------------------------------------------------
        FETCH LOGIN TIME + CHECK HOLIDAY
  ----------------------------------------------------- */
  useEffect(() => {
    if (!employeeId) return;

    const fetchLogin = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await axios.get(`${API_URL}/api/employee/working-hours`, {
          params: { employeeId, date: today },
        });

        if (res.data?.check_in) {
          let timeStr = res.data.check_in;

          // Convert "YYYY-MM-DDTHH:mm:ss" → "HH:mm:ss"
          if (timeStr.includes("T")) {
            timeStr = timeStr.split("T")[1];
          }

          setLoginTime(timeStr);
          localStorage.setItem("loginTime", timeStr);
        } else {
          setLoginTime(null);
          localStorage.setItem("loginTime", "00:00:00");
        }

        if (res.data?.officeStart) {
          setOfficeStart(res.data.officeStart);
          localStorage.setItem("officeStart", res.data.officeStart);
        }

        if (res.data?.officeEnd) {
          setOfficeEnd(res.data.officeEnd);
          localStorage.setItem("officeEnd", res.data.officeEnd);
        }

        if (res.data?.dailyWorkingHours) {
          setDailyWorkingHours(res.data.dailyWorkingHours);
          localStorage.setItem("dailyWorkingHours", res.data.dailyWorkingHours);
        }

      } catch (err) {
        console.error("Login fetch error:", err);
      }
    };

    const checkHoliday = async () => {
      try {
        const today = new Date().toISOString().split("T")[0];

        const res = await axios.get(`${API_URL}/api/employee/IsHoliday`, {
          params: { date: today }
        });

        if (res.data.isHoliday) {
          setIsHoliday(true);
          setHolidayTitle(res.data.title);
        } else {
          setIsHoliday(false);
        }
      } catch (err) {
        console.error("Holiday fetch error:", err);
      }
    };

    fetchLogin();
    checkHoliday();
  }, [employeeId]);

  /* -----------------------------------------------------
        WORKING HOURS TIMER
  ----------------------------------------------------- */
  useEffect(() => {
    if (isHoliday) {
      setWorkingHours("00:00:00");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      if (!loginTime || loginTime === "null") {
        setWorkingHours("00:00:00");
        return;
      }

      const parts = loginTime.split(":");
      if (parts.length < 2) {
        setWorkingHours("00:00:00");
        return;
      }

      const [lh, lm, ls] = parts.map(x => Number(x) || 0);

      const loginDT = new Date();
      loginDT.setHours(lh, lm, ls || 0, 0);

      const [osH, osM] = (officeStart || "09:30").split(":").map(Number);
      const [oeH, oeM] = (officeEnd || "18:30").split(":").map(Number);

      const officeStartDT = new Date();
      officeStartDT.setHours(osH, osM, 0, 0);

      const officeEndDT = new Date();
      officeEndDT.setHours(oeH, oeM, 0, 0);

      // Start working from office start or login time
      let workStart = loginDT < officeStartDT ? officeStartDT : loginDT;

      const maxEnd = new Date(workStart.getTime() + dailyWorkingHours * 3600 * 1000);

      let effectiveEnd = now;
      if (effectiveEnd > officeEndDT) effectiveEnd = officeEndDT;
      if (effectiveEnd > maxEnd) effectiveEnd = maxEnd;

      if (effectiveEnd <= workStart) {
        setWorkingHours("00:00:00");
        return;
      }

      const diffSec = Math.floor((effectiveEnd - workStart) / 1000);
      const hrs = Math.floor(diffSec / 3600);
      const mins = Math.floor((diffSec % 3600) / 60);
      const secs = diffSec % 60;

      setWorkingHours(`${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime, officeStart, officeEnd, dailyWorkingHours, isHoliday]);


  /* -----------------------------------------------------
        LOGOUT
  ----------------------------------------------------- */
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/employee/logout`, {
        employeeId: user._id,
      });
    } catch (err) {}

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatCurrentTime = () =>
    new Date().toLocaleTimeString("en-IN", { hour12: false });


  /* -----------------------------------------------------
        NAVBAR UI
  ----------------------------------------------------- */
  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
      style={{
        background: "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 50%, #2575FC 100%)",
        color: "white",
        minHeight: "65px",
      }}
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">

        {/* CENTER TITLE */}
        <div className="mx-auto text-center" style={{ flex: 1 }}>
          <span className="fw-bold text-white" style={{ fontSize: "2rem" }}>
            Employee Dashboard
          </span>
        </div>

        {/* RIGHT SECTION */}
        <div className="d-flex align-items-center gap-4 me-4">

          {/* Current Time */}
          <div className="text-white text-center">
            <div style={{ fontSize: "0.85rem" }}>Current Time</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {formatCurrentTime()}
            </div>
          </div>

          <div style={{ borderLeft: "2px solid rgba(255,255,255,0.3)", height: "40px" }} />

          {/* ------------------ HOLIDAY ------------------ */}
          {isHoliday ? (
            <div className="text-warning fw-bold text-center px-3">
              ⭐ Today is Holiday – {holidayTitle}
            </div>
          ) : (
            <>
              {/* Login Time */}
              <div className="text-white text-center">
                <div style={{ fontSize: "0.85rem" }}>Login Time</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
                  {(loginTime && loginTime !== "null") ? loginTime : "00:00:00"}
                </div>
              </div>

              <div style={{ borderLeft: "2px solid rgba(255,255,255,0.3)", height: "40px" }} />

              {/* Working Hours */}
              <div className="text-white text-center">
                <div style={{ fontSize: "0.85rem" }}>Working Hours</div>
                <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#FFD700" }}>
                  {workingHours}
                </div>
              </div>
            </>
          )}
        </div>

        {/* USER DROPDOWN */}
        <div className="dropdown">
          <button
            className="btn btn-light dropdown-toggle d-flex align-items-center px-3 fw-bold"
            type="button"
            data-bs-toggle="dropdown"
          >
            <FaUserCircle size={30} className="me-2 text-primary" />
            <span>{user?.ename || "Employee"}</span>
          </button>

          <ul className="dropdown-menu dropdown-menu-end shadow-sm">
            <li>
              <Button
                onClick={handleLogout}
                className="dropdown-item text-danger fw-bold"
              >
                Logout
              </Button>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
