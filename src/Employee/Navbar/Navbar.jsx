import React, { useState, useEffect, useMemo } from "react";
import { FaUserCircle } from "react-icons/fa";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../config";

function Navbar() {
  const navigate = useNavigate();

  /* ================= SAFE USER ================= */
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  }, []);

  const employeeId = user?.employeeId || user?._id || null;

  /* ================= STATES ================= */
  const [loginTime, setLoginTime] = useState("00:00:00");
  const [workingHours, setWorkingHours] = useState("00:00:00");
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHoliday, setIsHoliday] = useState(false);
  const [holidayTitle, setHolidayTitle] = useState("");
  const [notification, setNotification] = useState(null);

  const [officeStart, setOfficeStart] = useState("09:30");
  const [officeEnd, setOfficeEnd] = useState("18:30");
  const [dailyWorkingHours, setDailyWorkingHours] = useState(9);

  /* ================= FETCH LOGIN INFO ================= */
  useEffect(() => {
    if (!employeeId) return;

    const today = new Date().toISOString().split("T")[0];

    const fetchLoginData = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/employee/working-hours`,
          { params: { employeeId, date: today } }
        );

        let time = res.data?.check_in;
        if (time && time.includes("T")) time = time.split("T")[1];
        if (time && time.length === 5) time = `${time}:00`;

        setLoginTime(time || "00:00:00");

        if (res.data?.officeStart) setOfficeStart(res.data.officeStart);
        if (res.data?.officeEnd) setOfficeEnd(res.data.officeEnd);
        if (res.data?.dailyWorkingHours)
          setDailyWorkingHours(res.data.dailyWorkingHours);
      } catch (err) {
        console.error("Login fetch error", err.message);
      }
    };

    const checkHoliday = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/employee/IsHoliday`,
          { params: { date: today } }
        );

        if (res.data?.isHoliday) {
          setIsHoliday(true);
          setHolidayTitle(res.data.title);
        } else {
          setIsHoliday(false);
        }
      } catch (err) {
        console.error("Holiday error", err.message);
      }
    };

    fetchLoginData();
    checkHoliday();
  }, [employeeId]);

  /* ================= WORKING HOURS TIMER ================= */
  useEffect(() => {
    if (isHoliday || loginTime === "00:00:00") {
      setWorkingHours("00:00:00");
      return;
    }

    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const [lh, lm, ls] = loginTime.split(":").map(Number);
      const loginDT = new Date();
      loginDT.setHours(lh, lm, ls || 0, 0);

      const [osH, osM] = officeStart.split(":").map(Number);
      const [oeH, oeM] = officeEnd.split(":").map(Number);

      const officeStartDT = new Date();
      officeStartDT.setHours(osH, osM, 0, 0);

      const officeEndDT = new Date();
      officeEndDT.setHours(oeH, oeM, 0, 0);

      let workStart = loginDT < officeStartDT ? officeStartDT : loginDT;
      let workEnd = now;

      const maxEnd = new Date(
        workStart.getTime() + dailyWorkingHours * 3600 * 1000
      );

      if (workEnd > officeEndDT) workEnd = officeEndDT;
      if (workEnd > maxEnd) workEnd = maxEnd;

      const diff = Math.max(0, Math.floor((workEnd - workStart) / 1000));
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;

      setWorkingHours(
        `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`
      );
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime, officeStart, officeEnd, dailyWorkingHours, isHoliday]);

  /* ================= FETCH NOTIFICATION (ONLY ONE) ================= */
  useEffect(() => {
    if (!employeeId) return;

    axios
      .get(`${API_URL}/api/notifications/employee/${employeeId}`)
      .then((res) => {
        if (res.data?.length > 0) {
          setNotification(res.data[0]); // only latest
        }
      })
      .catch(() => {});
  }, [employeeId]);

  /* ================= CLICK NOTIFICATION ================= */
  const handleNotificationClick = async () => {
    try {
      await axios.patch(
        `${API_URL}/api/notifications/read/${notification._id}`
      );

      setNotification(null);
      navigate(`/employee/TaskView/${notification.task}`);
    } catch (err) {
      console.error("Notification click error", err);
    }
  };

  /* ================= LOGOUT ================= */
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  /* ================= UI ================= */
  return (
    <nav
      className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
      style={{
        background:
          "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 50%, #2575FC 100%)",
        color: "white",
      }}
    >
      <div className="container-fluid d-flex justify-content-between align-items-center">

        <div className="mx-auto fw-bold fs-3">Employee Dashboard</div>

        {notification && (
          <div
            className="px-4 py-2 rounded shadow"
            style={{ background: "white", color: "#333", cursor: "pointer" }}
            onClick={handleNotificationClick}
          >
            🔔 <strong>{notification.title}</strong>
            <div className="small text-muted">
              {notification.message}
            </div>
          </div>
        )}

        <div className="d-flex align-items-center gap-4">
          <div className="text-center">
            <small>Current Time</small>
            <div>{currentTime.toLocaleTimeString("en-IN", { hour12: false })}</div>
          </div>

          {!isHoliday && (
            <>
              <div className="text-center">
                <small>Login Time</small>
                <div>{loginTime}</div>
              </div>

              <div className="text-center">
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
              <FaUserCircle size={28} className="me-2 text-primary" />
              {user?.ename || "Employee"}
            </button>

            <ul className="dropdown-menu dropdown-menu-end">
              <li>
                <Button
                  className="dropdown-item text-danger"
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
