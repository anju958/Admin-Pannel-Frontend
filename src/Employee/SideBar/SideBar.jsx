

import React from 'react';
import { Link } from 'react-router-dom';
import { FaHome, FaUserCheck, FaUmbrellaBeach, FaMoneyBill, FaTasks, FaChartLine, FaHeadset, FaUserCircle } from 'react-icons/fa';

function SideBar() {
  return (
    <div className="sidebar-container" style={{
      background: "linear-gradient(180deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
      minHeight: "100vh",
      color: "white",
      padding: "0 16px"
    }}>
      <h4 className="sidebar-title pt-3 fw-bold" style={{ letterSpacing: "1px" }}>Employee Dashboard</h4>
      <ul className="sidebar-menu list-unstyled mt-4">
        {/* ...links, same as your version... */}
         <li>
          <Link to="">
            <FaHome className="sidebar-icon" /> Home
          </Link>
        </li>
        <li>
          <Link to="/employee/employeeattendance">
            <FaUserCheck className="sidebar-icon" /> Attendance
          </Link>
        </li>
        <li>
          <Link to="/employee/LeavePage">
            <FaUmbrellaBeach className="sidebar-icon" /> Leaves
          </Link>
        </li>
        <li>
          <Link to="/employee/salaryPage">
            <FaMoneyBill className="sidebar-icon" /> Salary
          </Link>
        </li>
        <li>
          <Link to="/employee/employeeTask">
            <FaTasks className="sidebar-icon" /> Task
          </Link>
        </li>
        <li>
          <Link to="/employee/performance">
            <FaChartLine className="sidebar-icon" /> Performance
          </Link>
        </li>
        <li>
          <Link to="/employee/supportHelp">
            <FaHeadset className="sidebar-icon" /> Support / Helpdesk
          </Link>
        </li>
        <li>
          <Link to="/employee/profile">
            <FaUserCircle className="sidebar-icon" /> Profile
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default SideBar;