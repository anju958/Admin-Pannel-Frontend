import React from 'react';
import Sidebar from '../../../Employee/SideBar/SideBar';
import Navbar from '../../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import ChatButtonAndPopup from '../../../chat/ChatButtonAndPopup';

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

      {/* Floating Chat Button */}
      {/* <ChatButtonAndPopup /> */}
    </div>
  );
}

export default EmployeeLayout;
