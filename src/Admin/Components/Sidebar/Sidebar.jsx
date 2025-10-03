

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

function Sidebar() {
  const [openMenu, setOpenMenu] = useState({
    employee: false,
    leads: false,
  });

  const toggleMenu = (menu) => {
    setOpenMenu((prev) => ({ ...prev, [menu]: !prev[menu] }));
  };

  return (
    <div className="sidebar">
      <div
        className="text-white vh-100 shadow"
        style={{
          width: "250px",
          background: "linear-gradient(180deg, #1A2A6C, #6A11CB, #2575FC)", // logo gradient
        }}
      >
        <h4 className="p-3 fw-bold border-bottom border-light">Admin Dashboard</h4>
        <ul className="nav flex-column">

          <li className="nav-item">
            <Link to="/admin/home" className="nav-link text-white">🏠 Home</Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/jobopening" className="nav-link text-white">📋 Job Opening</Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/department" className="nav-link text-white">🏢 Departments</Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/Service" className="nav-link text-white">🛠️ Services</Link>
          </li>

          {/* Employee Dropdown */}
          <li className="nav-item">
            <div
              className="nav-link text-white d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleMenu('employee')}
            >
              👨‍💼 Employee
              {openMenu.employee ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {openMenu.employee && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <Link to="/admin/employee" className="nav-link text-white">Employee</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/trainee" className="nav-link text-white">Intern & Trainee</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/TaskList" className="nav-link text-white">Task Assign</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/attendance" className="nav-link text-white">Attendance</Link>
                </li>
              </ul>
            )}
          </li>

          {/* Leads Dropdown */}
          <li className="nav-item">
            <div
              className="nav-link text-white d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleMenu('leads')}
            >
              📊 Leads
              {openMenu.leads ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {openMenu.leads && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <Link to="/admin/leads" className="nav-link text-white">Leads</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/client" className="nav-link text-white">Clients</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/PurposalList" className="nav-link text-white">Proposals</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/InvoicesList" className="nav-link text-white">Invoices</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/reports" className="nav-link text-white">Reports</Link>
                </li>
              </ul>
            )}
          </li>
           <li className="nav-item">
            <Link to="/admin/getProjectList" className="nav-link text-white">🗂️ Projects</Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/Roles" className="nav-link text-white">🔐 Roles & Permissions</Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/NoticeBoard" className="nav-link text-white">📢 Notice Board</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
