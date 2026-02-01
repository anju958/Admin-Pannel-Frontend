import React, { useState, useEffect, useMemo, useContext } from "react";
import { FaUserCircle } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";
import { AuthContext } from "../../Context/AuthContext";
import UniversalNotificationBell from "../../Admin/Components/Common/UniversalNotificationBell";

function Navbar() {
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  /* ================= USER ================= */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }, []);

  const employeeId = user?.employeeId;

  /* ================= STATE ================= */
  const [currentTime, setCurrentTime] = useState(new Date());
  const [loginTime, setLoginTime] = useState("00:00:00");
  const [workingHours, setWorkingHours] = useState("00:00:00");
  const [officeStart, setOfficeStart] = useState("09:30");
  const [officeEnd, setOfficeEnd] = useState("18:30");
  const [dailyWorkingHours, setDailyWorkingHours] = useState(9);
  const [isHoliday, setIsHoliday] = useState(false);

  /* ================= CLOCK ================= */
  useEffect(() => {
    const i = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(i);
  }, []);

  /* ================= LOGIN + OFFICE ================= */
  useEffect(() => {
    if (!employeeId) return;

    const today = new Date().toISOString().split("T")[0];

    const loadLogin = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/employee/working-hours`,
          { params: { employeeId, date: today } }
        );

        let time = res.data?.check_in || "00:00:00";
        if (time.includes("T")) time = time.split("T")[1];
        if (time.length === 5) time += ":00";

        setLoginTime(time);
        setOfficeStart(res.data?.officeStart || "09:30");
        setOfficeEnd(res.data?.officeEnd || "18:30");
        setDailyWorkingHours(res.data?.dailyWorkingHours || 9);
      } catch (err) {
        console.error("Login fetch error", err);
      }
    };

    const checkHoliday = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/employee/IsHoliday`,
          { params: { date: today } }
        );
        setIsHoliday(!!res.data?.isHoliday);
      } catch {}
    };

    loadLogin();
    checkHoliday();
  }, [employeeId]);

  /* ================= WORKING HOURS ================= */
  useEffect(() => {
    if (isHoliday || loginTime === "00:00:00") {
      setWorkingHours("00:00:00");
      return;
    }

    const i = setInterval(() => {
      const now = new Date();
      const [lh, lm, ls] = loginTime.split(":").map(Number);

      const loginDT = new Date();
      loginDT.setHours(lh, lm, ls || 0, 0);

      const [osH, osM] = officeStart.split(":").map(Number);
      const [oeH, oeM] = officeEnd.split(":").map(Number);

      const startDT = new Date();
      startDT.setHours(osH, osM, 0, 0);

      const endDT = new Date();
      endDT.setHours(oeH, oeM, 0, 0);

      let start = loginDT < startDT ? startDT : loginDT;
      let end = now;

      const maxEnd = new Date(start.getTime() + dailyWorkingHours * 3600000);
      if (end > endDT) end = endDT;
      if (end > maxEnd) end = maxEnd;

      const diff = Math.max(0, Math.floor((end - start) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setWorkingHours(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(i);
  }, [loginTime, officeStart, officeEnd, dailyWorkingHours, isHoliday]);

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    if (typeof logout === "function") logout();
    localStorage.clear();
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <nav
      className="navbar px-4 py-3 shadow-sm"
      style={{
        background:
          "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 50%, #2575FC 100%)",
        color: "white",
        position: "sticky",
        top: 0,
        zIndex: 1000,
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">
        <div className="fw-bold fs-4">Employee Dashboard</div>

        <div className="d-flex align-items-center gap-4">
          {/* 🔔 UNIVERSAL NOTIFICATION BELL */}
          <UniversalNotificationBell />

          <div className="text-center d-none d-md-block">
            <small>Current Time</small>
            <div>{currentTime.toLocaleTimeString("en-IN", { hour12: false })}</div>
          </div>

          {!isHoliday && (
            <>
              <div className="text-center d-none d-md-block">
                <small>Login Time</small>
                <div>{loginTime}</div>
              </div>

              <div className="text-center d-none d-md-block">
                <small>Working Hours</small>
                <div style={{ color: "#FFD700", fontWeight: "bold" }}>
                  {workingHours}
                </div>
              </div>
            </>
          )}

          <div className="dropdown">
            <button
              className="btn btn-light dropdown-toggle d-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <FaUserCircle className="me-2" />
              <span className="d-none d-sm-inline">{user?.ename || "Employee"}</span>
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Button
                  className="dropdown-item text-danger fw-bold"
                  onClick={handleLogout}
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
