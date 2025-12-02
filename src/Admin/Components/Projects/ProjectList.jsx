import axios from "axios";
import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// ✅ permission helpers
const canDo = (user, module, action) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.[action] === true;
};

const canViewPage = (user, module) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.view === true;
};

const ProjectList = () => {
  const [projects, setProjects] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ✅ Fetch all projects
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getProjects`);
        setProjects(res.data);
      } catch (err) {
        console.error("Error fetching projects:", err);
      }
    };
    fetchProjects();
  }, []);

  // ✅ Delete project (permission protected)
  const handleDelete = async (projectId, projectName) => {
    if (!canDo(user, "projects", "delete")) {
      return alert("You do not have permission to delete projects.");
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete project "${projectName}"?`
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/deleteProjectById/${projectId}`);
      alert("Project deleted successfully!");
      setProjects((prev) => prev.filter((proj) => proj._id !== projectId));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete project.");
    }
  };

  // ✅ View project
  const handleView = (id) => {
    if (!canDo(user, "projects", "view")) {
      return alert("You do not have permission to view project details.");
    }
    navigate(`/admin/getAllprojects/${id}`);
  };

  // ✅ PAGE ACCESS CHECK
  if (!canViewPage(user, "projects")) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view projects.</p>
      </div>
    );
  }

  // ✅ Excel Export
  const exportExcel = () => {
    const rows = projects.map((proj, i) => ({
      S_No: i + 1,
      Project_ID: proj.projectId,
      Project_Name: proj.projectName,
      Client: proj.clientId?.leadName || "N/A",
      Start_Date: proj.startDate ? new Date(proj.startDate).toLocaleDateString() : "-",
      End_Date: proj.endDate ? new Date(proj.endDate).toLocaleDateString() : "-",
      Category: Array.isArray(proj.projectCategory)
        ? proj.projectCategory.join(", ")
        : proj.projectCategory,
      Members: proj.addMember?.map((m) => m.ename).join(", ") || "N/A",
      Budget: proj.price || 0,
    }));

    const sheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, sheet, "Projects");
    XLSX.writeFile(workbook, "Projects_List.xlsx");
  };


  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">📋 All Projects</h2>
      {/* Search + Excel Download */}
      <div className="d-flex justify-content-between align-items-center mb-3">

        {/* Search Input */}
        <input
          type="text"
          className="form-control w-50"
          placeholder="Search project..."
          
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Excel Button */}
        <button className="btn btn-success px-4" onClick={exportExcel}>
          ⬇️ Download Excel
        </button>

      </div>


      <div className="table-responsive shadow-lg rounded">
        <table className="table table-striped table-hover align-middle text-center">
          <thead className="table-dark sticky-top">
            <tr>
              <th>Project ID</th>
              <th>Project Name</th>
              <th>Client Name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Category</th>
              <th>Added Member</th>
              <th>Budget</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {projects.map((project) => (
              <tr key={project._id}>
                <td>
                  <span className="badge bg-secondary">
                    {project.projectId}
                  </span>
                </td>

                <td className="fw-bold">{project.projectName}</td>

                <td>{project.clientId?.leadName || "N/A"}</td>

                <td>
                  {new Date(project.startDate).toLocaleDateString()}
                </td>

                <td>
                  {new Date(project.endDate).toLocaleDateString()}
                </td>

                {/* Category */}
                <td>
                  <span className="badge bg-info text-dark">
                    {project.projectCategory && project.projectCategory.length > 0
                      ? (() => {
                        try {
                          const parsed = JSON.parse(project.projectCategory[0]);
                          return Array.isArray(parsed)
                            ? parsed.join(", ")
                            : parsed;
                        } catch (e) {
                          return project.projectCategory[0];
                        }
                      })()
                      : "N/A"}
                  </span>
                </td>

                {/* Added Members */}
                <td>
                  {project.addMember && project.addMember.length > 0 ? (
                    <div className="d-flex align-items-center justify-content-center">
                      {project.addMember.slice(0, 4).map((emp, i) => (
                        <div
                          key={emp._id || i}
                          className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center border border-white"
                          style={{
                            width: "35px",
                            height: "35px",
                            fontSize: "14px",
                            fontWeight: "bold",
                            marginLeft: i === 0 ? "0px" : "-10px",
                            zIndex: project.addMember.length - i,
                          }}
                          title={emp.ename || "Unknown"}
                        >
                          {emp.ename ? emp.ename.charAt(0).toUpperCase() : "?"}
                        </div>
                      ))}

                      {project.addMember.length > 4 && (
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center border border-white"
                          style={{
                            width: "35px",
                            height: "35px",
                            fontSize: "12px",
                            fontWeight: "bold",
                            marginLeft: "-10px",
                          }}
                        >
                          +{project.addMember.length - 4}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted">Not Assigned</span>
                  )}
                </td>

                <td>
                  <span className="badge bg-success">
                    ₹ {project.price?.toLocaleString()}
                  </span>
                </td>

                {/* ✅ ACTION BUTTONS WITH PERMISSIONS */}
                <td>
                  {/* View */}
                  {canDo(user, "projects", "view") && (
                    <button
                      className="btn btn-info me-2"
                      onClick={() => handleView(project._id)}
                    >
                      View
                    </button>
                  )}

                  {/* Delete */}
                  {canDo(user, "projects", "delete") && (
                    <button
                      className="btn btn-danger"
                      onClick={() =>
                        handleDelete(project._id, project.projectName)
                      }
                    >
                      🗑️ Delete
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProjectList;
