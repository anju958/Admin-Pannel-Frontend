// import React, { useState, useEffect } from 'react';
// import { FaUserCircle } from "react-icons/fa";
// import Button from '@mui/material/Button';
// import { useNavigate } from 'react-router-dom';
// import axios from 'axios';
// import { API_URL } from '../../config';

// function Navbar() {
//   const user = JSON.parse(localStorage.getItem("user"));
//   const navigate = useNavigate();

//   const [loginTime, setLoginTime] = useState(null);
//   const [workingHours, setWorkingHours] = useState('0:00:00');
//   const [currentTime, setCurrentTime] = useState(new Date());

//   // Fetch Login Time from backend
//   useEffect(() => {
//     const fetchLoginTime = async () => {
//       if (!user?._id) return;

//       try {
//         const today = new Date().toISOString().split('T')[0];

//         const res = await axios.get(`${API_URL}/api/employee/working-hours`, {
//           params: { employeeId: user._id, date: today },
//         });

//         if (res.data?.check_in) {
//           setLoginTime(res.data.check_in);
//         }
//       } catch (err) {
//         console.error("Error fetching login time:", err);
//       }
//     };

//     fetchLoginTime();
//   }, [user?._id]);

//   // Real-time working hours counter
//   useEffect(() => {
//     const interval = setInterval(() => {
//       setCurrentTime(new Date());

//       if (loginTime) {
//         const [hrs, mins, secs] = loginTime.split(':').map(Number);

//         const loginDateTime = new Date();
//         loginDateTime.setHours(hrs, mins, secs, 0);

//         const diff = new Date() - loginDateTime;
//         const totalSeconds = Math.floor(diff / 1000);

//         const h = Math.floor(totalSeconds / 3600);
//         const m = Math.floor((totalSeconds % 3600) / 60);
//         const s = totalSeconds % 60;

//         setWorkingHours(
//           `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
//         );
//       }
//     }, 1000);

//     return () => clearInterval(interval);
//   }, [loginTime]);

//   const formatCurrentTime = () => {
//     return new Date().toLocaleTimeString('en-IN', { hour12: false });
//   };

//   // FIXED LOGOUT
//   const handleLogout = async () => {
//     try {
//       await axios.post(`${API_URL}/api/employee/logout`, {
//         employeeId: user._id, // FIXED
//       });
//     } catch (err) {
//       console.error("Logout error:", err);
//     } finally {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       navigate("/");
//     }
//   };

//   return (
//     <nav
//       className="navbar navbar-expand-lg px-4 py-3 shadow-sm"
//       style={{
//         background: "linear-gradient(90deg, #1A2A6C 0%, #6A11CB 50%, #2575FC 100%)",
//         color: "white",
//         minHeight: "65px"
//       }}
//     >
//       <div className="container-fluid d-flex align-items-center justify-content-between">

//         <div className="mx-auto text-center" style={{ flex: 1 }}>
//           <span className="fw-bold text-white" style={{ fontSize: "2rem" }}>
//             Employee Dashboard
//           </span>
//         </div>

//         {/* Time Info Section */}
//         <div className="d-flex align-items-center gap-4 me-4">
//           <div className="text-white text-center">
//             <div style={{ fontSize: "0.85rem" }}>Current Time</div>
//             <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
//               {formatCurrentTime()}
//             </div>
//           </div>

//           <div style={{ borderLeft: "2px solid rgba(255,255,255,0.3)", height: "40px" }} />

//           <div className="text-white text-center">
//             <div style={{ fontSize: "0.85rem" }}>Login Time</div>
//             <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
//               {loginTime || "Loading..."}
//             </div>
//           </div>

//           <div style={{ borderLeft: "2px solid rgba(255,255,255,0.3)", height: "40px" }} />

//           <div className="text-white text-center">
//             <div style={{ fontSize: "0.85rem" }}>Working Hours</div>
//             <div style={{ fontSize: "1.1rem", fontWeight: "bold", color: "#FFD700" }}>
//               {workingHours}
//             </div>
//           </div>
//         </div>

//         {/* User Dropdown */}
//         <div className="dropdown">
//           <button
//             className="btn btn-light dropdown-toggle d-flex align-items-center px-3 fw-bold"
//             type="button"
//             data-bs-toggle="dropdown"
//           >
//             <FaUserCircle size={30} className="me-2 text-primary" />
//             <span>{user?.ename || "Employee"}</span>
//           </button>

//           <ul className="dropdown-menu dropdown-menu-end shadow-sm">
//             <li>
//               <Button onClick={handleLogout} className="dropdown-item text-danger fw-bold">
//                 Logout
//               </Button>
//             </li>
//           </ul>
//         </div>
//       </div>
//     </nav>
//   );
// }

// export default Navbar;

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

  const [loginTime, setLoginTime] = useState(null);
  const [workingHours, setWorkingHours] = useState('0:00:00');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [idleMinutes, setIdleMinutes] = useState(0);

  // ADD THIS: Idle tracking
  const lastActiveRef = useRef(new Date());
  const idleAccumRef = useRef(0);

  /* -----------------------------------------------------
     FETCH LOGIN TIME
  ----------------------------------------------------- */
  useEffect(() => {
    const fetchLogin = async () => {
      if (!employeeId) return;

      try {
        const today = new Date().toISOString().split("T")[0];
        const res = await axios.get(`${API_URL}/api/employee/working-hours`, {
          params: { employeeId, date: today },
        });

        if (res.data?.check_in) setLoginTime(res.data.check_in);
        if (res.data?.idleTime) setIdleMinutes(res.data.idleTime);
      } catch (err) {
        console.error("Login fetch error:", err);
      }
    };

    fetchLogin();
  }, [employeeId]);

  /* -----------------------------------------------------
     CLOCK + WORKING HOURS
  ----------------------------------------------------- */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());

      if (loginTime) {
        const [h, m, s] = loginTime.split(":").map(Number);
        const loginDT = new Date();
        loginDT.setHours(h, m, s, 0);

        const diff = new Date() - loginDT;
        const totalSecs = Math.floor(diff / 1000);

        const hrs = Math.floor(totalSecs / 3600);
        const mins = Math.floor((totalSecs % 3600) / 60);
        const secs = totalSecs % 60;

        setWorkingHours(`${hrs}:${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [loginTime]);


  /* -----------------------------------------------------
     LOGOUT
  ----------------------------------------------------- */
  const handleLogout = async () => {
    try {
      await axios.post(`${API_URL}/api/employee/logout`, {
        employeeId: user._id,
      });
    } catch (err) {
      console.error("Logout error:", err);
    }

    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const formatCurrentTime = () =>
    new Date().toLocaleTimeString("en-IN", { hour12: false });

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

          {/* Login Time */}
          <div className="text-white text-center">
            <div style={{ fontSize: "0.85rem" }}>Login Time</div>
            <div style={{ fontSize: "1.1rem", fontWeight: "bold" }}>
              {loginTime || "Loading..."}
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

          <div style={{ borderLeft: "2px solid rgba(255,255,255,0.3)", height: "40px" }} />

          {/* IDLE TIME (NEW) */}
          
        </div>

        {/* USER MENU */}
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
              <Button onClick={handleLogout} className="dropdown-item text-danger fw-bold">
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
