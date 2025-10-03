
import React from 'react';
import Sidebar from '../../../Employee/SideBar/SideBar';
import Navbar from '../../Navbar/Navbar';
import { Outlet } from 'react-router-dom';


function EmployeeLayout() {
  return (
    <div className="employee-layout">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="employee-content">
        <Navbar />
        <div className="employee-main">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default EmployeeLayout;
