import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';
import { AuthContext } from '../../../Context/AuthContext';

function Sidebar() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [openMenu, setOpenMenu] = useState({
    employee: false,
    leads: false,
  });

  const toggleMenu = (menu) => setOpenMenu(prev => ({ ...prev, [menu]: !prev[menu] }));
  const isActive = path => location.pathname === path;
  const isParentActive = paths => paths.some(path => location.pathname === path);

  const activeLinkStyle = {
    background: 'rgba(255, 255, 255, 0.2)',
    borderLeft: '4px solid #fff',
    fontWeight: '600',
    borderRadius: '8px',
    margin: '4px 8px',
    padding: '10px 16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
  };

  const normalLinkStyle = {
    borderRadius: '8px',
    margin: '4px 8px',
    padding: '10px 16px',
    transition: 'all 0.3s ease'
  };

  const activeParentStyle = {
    background: 'rgba(255, 255, 255, 0.15)',
    borderLeft: '4px solid #FFD700',
    fontWeight: '600',
    borderRadius: '8px',
    margin: '4px 8px',
    padding: '10px 16px'
  };

  // Permissions keys must match your backend structure!
  const modulePermissions = {
    home: 'Home',
    jobOpening: 'Job Opening',
    department: 'Departments',
    employee: 'Employees',
    trainee: 'Intern',
    attendance: 'Attendance',
    leads: 'Leads',
    client: 'Clients',
    proposalList: 'Proposals',
    invoicesList: 'Invoices',
    reports: 'Reports',
    projectList: 'Projects',
    createUser: 'UserManagement',
    complaints: 'Complaints',
    noticeBoard: 'Notice Board',
    companyDetails: 'Company Details',
    settings: 'Company Details'
  };

  // Superadmin sees all; others by permissions object
  const canView = (mod) => {
    if (!user) return false;
    if (user.role === 'superadmin') return true;
    return user.permissions?.[mod]?.includes('View');
  };

  return (
    <div className="sidebar">
      <div className="text-white vh-100 shadow" style={{ width: "250px", background: "linear-gradient(180deg, #1A2A6C, #6A11CB, #2575FC)" }}>
        <h4 className="p-3 fw-bold border-bottom border-light">Admin Dashboard</h4>
        <ul className="nav flex-column">

          {canView(modulePermissions.home) && (
            <li className="nav-item">
              <Link to="/admin/home" className="nav-link text-white" style={isActive('/admin/home') ? activeLinkStyle : normalLinkStyle}>
                🏠 Home
              </Link>
            </li>
          )}

          {canView(modulePermissions.jobOpening) && (
            <li className="nav-item">
              <Link to="/admin/jobopening" className="nav-link text-white" style={isActive('/admin/jobopening') ? activeLinkStyle : normalLinkStyle}>
                📋 Job Opening
              </Link>
            </li>
          )}

          {canView(modulePermissions.department) && (
            <li className="nav-item">
              <Link to="/admin/department" className="nav-link text-white" style={isActive('/admin/department') ? activeLinkStyle : normalLinkStyle}>
                🏢 Departments
              </Link>
            </li>
          )}

          {(canView(modulePermissions.employee) || canView(modulePermissions.trainee) || canView(modulePermissions.attendance)) && (
            <li className="nav-item">
              <div
                className="nav-link text-white d-flex justify-content-between align-items-center"
                style={{
                  cursor: 'pointer',
                  ...(isParentActive(['/admin/employee', '/admin/trainee', '/admin/attendance'])
                    ? activeParentStyle
                    : normalLinkStyle)
                }}
                onClick={() => toggleMenu('employee')}
              >
                👨‍💼 Employee
                {openMenu.employee ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openMenu.employee && (
                <ul className="nav flex-column ms-3">
                  {canView(modulePermissions.employee) && (
                    <li className="nav-item">
                      <Link to="/admin/employee" className="nav-link text-white" style={isActive('/admin/employee') ? activeLinkStyle : normalLinkStyle}>
                        Employee
                      </Link>
                    </li>
                  )}
                  {canView(modulePermissions.trainee) && (
                    <li className="nav-item">
                      <Link to="/admin/trainee" className="nav-link text-white" style={isActive('/admin/trainee') ? activeLinkStyle : normalLinkStyle}>
                        Intern & Trainee
                      </Link>
                    </li>
                  )}
                  {canView(modulePermissions.attendance) && (
                    <li className="nav-item">
                      <Link to="/admin/attendance" className="nav-link text-white" style={isActive('/admin/attendance') ? activeLinkStyle : normalLinkStyle}>
                        Attendance
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {(canView(modulePermissions.leads) || canView(modulePermissions.client)) && (
            <li className="nav-item">
              <div
                className="nav-link text-white d-flex justify-content-between align-items-center"
                style={{
                  cursor: 'pointer',
                  ...(isParentActive(['/admin/leads', '/admin/client'])
                    ? activeParentStyle
                    : normalLinkStyle)
                }}
                onClick={() => toggleMenu('leads')}
              >
                📊 Leads
                {openMenu.leads ? <FaChevronDown /> : <FaChevronRight />}
              </div>
              {openMenu.leads && (
                <ul className="nav flex-column ms-3">
                  {canView(modulePermissions.leads) && (
                    <li className="nav-item">
                      <Link to="/admin/leads" className="nav-link text-white" style={isActive('/admin/leads') ? activeLinkStyle : normalLinkStyle}>
                        Leads
                      </Link>
                    </li>
                  )}
                  {canView(modulePermissions.client) && (
                    <li className="nav-item">
                      <Link to="/admin/client" className="nav-link text-white" style={isActive('/admin/client') ? activeLinkStyle : normalLinkStyle}>
                        Clients
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {canView(modulePermissions.proposalList) && (
            <li className="nav-item">
              <Link to="/admin/PurposalList" className="nav-link text-white" style={isActive('/admin/PurposalList') ? activeLinkStyle : normalLinkStyle}>
                📄 Proposals
              </Link>
            </li>
          )}

          {canView(modulePermissions.invoicesList) && (
            <li className="nav-item">
              <Link to="/admin/InvoicesList" className="nav-link text-white" style={isActive('/admin/InvoicesList') ? activeLinkStyle : normalLinkStyle}>
                💰 Invoices
              </Link>
            </li>
          )}

          {canView(modulePermissions.reports) && (
            <li className="nav-item">
              <Link to="/admin/reports" className="nav-link text-white" style={isActive('/admin/reports') ? activeLinkStyle : normalLinkStyle}>
                📈 Reports
              </Link>
            </li>
          )}

          {canView(modulePermissions.projectList) && (
            <li className="nav-item">
              <Link to="/admin/getProjectList" className="nav-link text-white" style={isActive('/admin/getProjectList') ? activeLinkStyle : normalLinkStyle}>
                🗂️ Projects
              </Link>
            </li>
          )}

          {canView(modulePermissions.createUser) && (
            <li className="nav-item">
              <Link to="/admin/CreateUser" className="nav-link text-white" style={isActive('/admin/CreateUser') ? activeLinkStyle : normalLinkStyle}>
                Create User
              </Link>
            </li>
          )}

          {canView(modulePermissions.complaints) && (
            <li className="nav-item">
              <Link to="/admin/companyDetails" className="nav-link text-white" style={isActive('/admin/supportHelp') ? activeLinkStyle : normalLinkStyle}>
                🆘 Complaints
              </Link>
            </li>
          )}

          {canView(modulePermissions.noticeBoard) && (
            <li className="nav-item">
              <Link to="/admin/NoticeBoard" className="nav-link text-white" style={isActive('/admin/NoticeBoard') ? activeLinkStyle : normalLinkStyle}>
                📢 Notice Board
              </Link>
            </li>
          )}

          {canView(modulePermissions.companyDetails) && (
            <li className="nav-item">
              <Link to="/admin/companyDetails" className="nav-link text-white" style={isActive('/admin/companyDetails') ? activeLinkStyle : normalLinkStyle}>
                ⚙️ Settings
              </Link>
            </li>
          )}

        </ul>
      </div>
    </div>
  );
}

export default Sidebar;
