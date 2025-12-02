import React, { useState, useContext } from "react";
import { Link, useLocation } from "react-router-dom";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import { AuthContext } from "../../../Context/AuthContext";
import { canView } from "../../../utils/acl";
import PersonAddIcon from '@mui/icons-material/PersonAdd';


export default function Sidebar() {
  const location = useLocation();
  const { user } = useContext(AuthContext);

  const [openMenu, setOpenMenu] = useState({
    people: false,
    leads: false,
  });

  const isActive = (p) => location.pathname === p;
  const isParentActive = (paths) => paths.some((p) => isActive(p));
  const toggle = (m) => setOpenMenu((s) => ({ ...s, [m]: !s[m] }));

  const activeLinkStyle = {
    background: "rgba(255, 255, 255, 0.2)",
    borderLeft: "4px solid #fff",
    fontWeight: 600,
    borderRadius: 8,
    margin: "4px 8px",
    padding: "10px 16px",
    boxShadow: "0 2px 8px rgba(0,0,0,.15)",
  };
  const normalLinkStyle = {
    borderRadius: 8,
    margin: "4px 8px",
    padding: "10px 16px",
    transition: "all .3s ease",
  };
  const activeParentStyle = {
    background: "rgba(255, 255, 255, 0.15)",
    borderLeft: "4px solid #FFD700",
    fontWeight: 600,
    borderRadius: 8,
    margin: "4px 8px",
    padding: "10px 16px",
  };

  return (
    <div className="sidebar">
      <div
        className="text-white shadow"
        style={{
          width: 250,
          minHeight: "100vh",
          height: "auto",
          background: "linear-gradient(180deg, #1A2A6C, #6A11CB, #2575FC)",
          overflowY: "auto",
          paddingBottom: "20px"
        }}
      >

        <h4 className="p-3 fw-bold border-bottom border-light">Admin Dashboard</h4>
        <ul className="nav flex-column">

          {canView(user, "home") && (
            <li className="nav-item">
              <Link
                to="/admin/home"
                className="nav-link text-white"
                style={isActive("/admin/home") ? activeLinkStyle : normalLinkStyle}
              >
                🏠 Home
              </Link>
            </li>
          )}

          {canView(user, "jobOpenings") && (
            <li className="nav-item">
              <Link
                to="/admin/jobopening"
                className="nav-link text-white"
                style={
                  isActive("/admin/jobopening") ? activeLinkStyle : normalLinkStyle
                }
              >
                📋 Job Openings
              </Link>
            </li>
          )}

          {canView(user, "departments") && (
            <li className="nav-item">
              <Link
                to="/admin/department"
                className="nav-link text-white"
                style={
                  isActive("/admin/department") ? activeLinkStyle : normalLinkStyle
                }
              >
                🏢 Departments
              </Link>
            </li>
          )}

          {(canView(user, "employees") ||
            canView(user, "trainees") ||
            canView(user, "attendance") ||
            canView(user, "salaries")) && (
              <li className="nav-item">
                <div
                  className="nav-link text-white d-flex justify-content-between align-items-center"
                  style={
                    isParentActive([
                      "/admin/employee",
                      "/admin/trainee",
                      "/admin/attendance",
                      "/admin/salary",
                    ])
                      ? activeParentStyle
                      : normalLinkStyle
                  }
                  onClick={() => toggle("people")}
                >
                  👨‍💼 People
                  {openMenu.people ? <FaChevronDown /> : <FaChevronRight />}
                </div>

                {openMenu.people && (
                  <ul className="nav flex-column ms-3">
                    {canView(user, "employees") && (
                      <li className="nav-item">
                        <Link
                          to="/admin/employee"
                          className="nav-link text-white"
                          style={
                            isActive("/admin/employee")
                              ? activeLinkStyle
                              : normalLinkStyle
                          }
                        >
                          Employees
                        </Link>
                      </li>
                    )}
                    {canView(user, "trainees") && (
                      <li className="nav-item">
                        <Link
                          to="/admin/trainee"
                          className="nav-link text-white"
                          style={
                            isActive("/admin/trainee")
                              ? activeLinkStyle
                              : normalLinkStyle
                          }
                        >
                          Interns & Trainees
                        </Link>
                      </li>
                    )}
                    {canView(user, "attendance") && (
                      <li className="nav-item">
                        <Link
                          to="/admin/attendance"
                          className="nav-link text-white"
                          style={
                            isActive("/admin/attendance")
                              ? activeLinkStyle
                              : normalLinkStyle
                          }
                        >
                          Attendance
                        </Link>
                      </li>
                    )}
                    {canView(user, "salaries") && (
                      <li className="nav-item">
                        <Link
                          to="/admin/AdminSalaryPage"
                          className="nav-link text-white"
                          style={
                            isActive("/admin/AdminSalaryPage")
                              ? activeLinkStyle
                              : normalLinkStyle
                          }
                        >
                          Salaries
                        </Link>
                      </li>
                    )}
                    {canView(user, "salaries") && (
                      <li className="nav-item">
                        <Link
                          to="/admin/AdminLeavePage"
                          className="nav-link text-white"
                          style={
                            isActive("/admin/AdminLeavePage")
                              ? activeLinkStyle
                              : normalLinkStyle
                          }
                        >
                          Leaves
                        </Link>
                      </li>
                    )}
                  </ul>
                )}
              </li>
            )}

          {(canView(user, "leads") || canView(user, "clients")) && (
            <li className="nav-item">
              <div
                className="nav-link text-white d-flex justify-content-between align-items-center"
                style={
                  isParentActive(["/admin/leads", "/admin/client"])
                    ? activeParentStyle
                    : normalLinkStyle
                }
                onClick={() => toggle("leads")}
              >
                📊 Leads
                {openMenu.leads ? <FaChevronDown /> : <FaChevronRight />}
              </div>

              {openMenu.leads && (
                <ul className="nav flex-column ms-3">
                  {canView(user, "leads") && (
                    <li className="nav-item">
                      <Link
                        to="/admin/leads"
                        className="nav-link text-white"
                        style={
                          isActive("/admin/leads")
                            ? activeLinkStyle
                            : normalLinkStyle
                        }
                      >
                        Leads
                      </Link>
                    </li>
                  )}
                  {canView(user, "clients") && (
                    <li className="nav-item">
                      <Link
                        to="/admin/client"
                        className="nav-link text-white"
                        style={
                          isActive("/admin/client")
                            ? activeLinkStyle
                            : normalLinkStyle
                        }
                      >
                        Clients
                      </Link>
                    </li>
                  )}
                </ul>
              )}
            </li>
          )}

          {canView(user, "proposals") && (
            <li className="nav-item">
              <Link
                to="/admin/PurposalList"
                className="nav-link text-white"
                style={
                  isActive("/admin/PurposalList")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                📄 Proposals
              </Link>
            </li>
          )}
          {canView(user, "proposals") && (
            <li className="nav-item">
              <Link
                to="/admin/TaskList"
                className="nav-link text-white"
                style={
                  isActive("/admin/TaskList")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                📄 Task
              </Link>
            </li>
          )}

          {canView(user, "invoices") && (
            <li className="nav-item">
              <Link
                to="/admin/InvoicesList"
                className="nav-link text-white"
                style={
                  isActive("/admin/InvoicesList")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                💰 Invoices
              </Link>
            </li>
          )}

          {canView(user, "reports") && (
            <li className="nav-item">
              <Link
                to="/admin/reports"
                className="nav-link text-white"
                style={
                  isActive("/admin/reports") ? activeLinkStyle : normalLinkStyle
                }
              >
                📈 Reports
              </Link>
            </li>
          )}

          {canView(user, "projects") && (
            <li className="nav-item">
              <Link
                to="/admin/getProjectList"
                className="nav-link text-white"
                style={
                  isActive("/admin/getProjectList")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                🗂️ Projects
              </Link>
            </li>
          )}
          {canView(user, "projects") && (
            <li className="nav-item">
              <Link
                to="/admin/HRIS"
                className="nav-link text-white"
                style={
                  isActive("/admin/HRIS")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                HRIS
              </Link>
            </li>
          )}

          {canView(user, "users") && (
            <li className="nav-item">
              <Link
                to="/admin/CreateUser"
                className="nav-link text-white"
                style={
                  isActive("/admin/CreateUser")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                <PersonAddIcon /> Create User
              </Link>
            </li>
          )}

          {canView(user, "noticeBoard") && (
            <li className="nav-item">
              <Link
                to="/admin/NoticeBoard"
                className="nav-link text-white"
                style={
                  isActive("/admin/NoticeBoard")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                📢 Notice Board
              </Link>
            </li>
          )}
          {/* {canView(user, "noticeBoard") && (
            <li className="nav-item">
              <Link to="/admin/view-all-chats"  className="nav-link text-white" style={{ color: '#fff', fontWeight: 600 }}>
                <i className="bi bi-chat-dots" /> View All Chats
              </Link>
            </li>
          )} */}

          {canView(user, "company") && (
            <li className="nav-item">
              <Link
                to="/admin/companyDetails"
                className="nav-link text-white"
                style={
                  isActive("/admin/companyDetails")
                    ? activeLinkStyle
                    : normalLinkStyle
                }
              >
                ⚙️ Settings
              </Link>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}
