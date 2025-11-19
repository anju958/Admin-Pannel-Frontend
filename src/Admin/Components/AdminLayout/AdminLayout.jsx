import React from 'react';
import Sidebar from '../Sidebar/Sidebar';
import Navbar from '../Navbar/Navbar';
import { Outlet } from 'react-router-dom';
import ChatButtonAndPopup from '../../../chat/ChatButtonAndPopup';

function AdminLayout() {
  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      overflow: 'hidden'
    }}>
      {/* Fixed Sidebar */}
      <div style={{
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        width: '250px',
        overflowY: 'auto',
        overflowX: 'hidden',
        zIndex: 1000,
        background: 'linear-gradient(180deg, #2d3561 0%, #6b46c1 100%)'
      }}>
        <Sidebar />
      </div>
      
      {/* Main content area */}
      <div style={{
        flex: 1,
        marginLeft: '250px',
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden'
      }}>
        {/* Fixed Navbar */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 999,
          background: 'linear-gradient(90deg, #2d3561 0%, #6b46c1 100%)',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
          flexShrink: 0
        }}>
          <Navbar />
        </div>
        
        {/* Scrollable content */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'auto',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa'
        }}>
          <Outlet />
        </div>
      </div>

      {/* Floating Chat Popup */}
      {/* <ChatButtonAndPopup /> */}
    </div>
  );
}

export default AdminLayout;
