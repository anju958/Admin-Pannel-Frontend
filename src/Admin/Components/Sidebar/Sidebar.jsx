

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa'; // arrows

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
      <div className="bg-success p-3 text-dark bg-opacity-25 text-black vh-100" style={{ width: "250px" }}>
        <h4 className="p-3">Admin Dashboard</h4>
        <ul className="nav flex-column">

          <li className="nav-item">
            <Link to="/admin/home" className="nav-link text-black list">Home</Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/jobopening" className="nav-link text-black list">Job Opening</Link>
          </li>

          <li className="nav-item">
            <Link to="/admin/department" className="nav-link text-black list">Departments</Link>
          </li>
          <li className="nav-item">
            <Link to="/admin/Service" className="nav-link text-black list">Services</Link>
          </li>

        
          <li className="nav-item">
            <div
              className="nav-link text-black list d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleMenu('employee')}
            >
              Employee
              {openMenu.employee ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {openMenu.employee && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <Link to="/admin/employee" className="nav-link text-black list">Employee</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/trainee" className="nav-link text-black list">Intern and Trainee</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/taskassign" className="nav-link text-black list">Task Assign</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/attendance" className="nav-link text-black list">Attendance</Link>
                </li>
              </ul>
            )}
          </li>

        
          <li className="nav-item">
            <div
              className="nav-link text-black list d-flex justify-content-between align-items-center"
              style={{ cursor: 'pointer' }}
              onClick={() => toggleMenu('leads')}
            >
              Leads
              {openMenu.leads ? <FaChevronDown /> : <FaChevronRight />}
            </div>
            {openMenu.leads && (
              <ul className="nav flex-column ms-3">
                <li className="nav-item">
                  <Link to="/admin/leads" className="nav-link text-black list">Leads</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/client" className="nav-link text-black list">Clients</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link text-black list">Proposals</Link>
                </li>
                <li className="nav-item">
                  <Link to="#" className="nav-link text-black list">Invoices</Link>
                </li>
                <li className="nav-item">
                  <Link to="/admin/reports" className="nav-link text-black list">Reports</Link>
                </li>
              </ul>
            )}
          </li>

          <li className="nav-item">
            <Link to="#" className="nav-link text-black list">Roles and Permissions</Link>
          </li>

          <li className="nav-item">
            <Link to="#" className="nav-link text-black list">Notice Board</Link>
          </li>

        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
