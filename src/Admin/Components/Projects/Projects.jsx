
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

const ShowProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/getprojectByPorjectId/${id}`
        );
        setProject(res.data);
      } catch (err) {
        console.error("Error fetching project:", err);
      }
    };
    fetchProject();
  }, [id]);

  const handleUpdate = () => {
    navigate(`/project/edit/${id}`);
  };

  
  if (!project) return <p className="text-center mt-5">Loading project...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Project Details: {project.projectName}</h3>
        </div>
        <div className="card-body">
          <table className="table table-striped table-hover align-middle">
            <tbody>
              <tr>
                <th>Project ID</th>
                <td><span className="badge bg-secondary">{project.projectId}</span></td>
              </tr>
              <tr>
                <th>Project Name</th>
                <td className="fw-bold">{project.projectName}</td>
              </tr>
              <tr>
                <th>Department</th>
                <td>{project.department?.deptName || "N/A"}</td>
              </tr>
              <tr>
                <th>Service</th>
                <td>{project.service?.serviceName || "N/A"}</td>
              </tr>
              <tr>
                <th>Start Date</th>
                <td>{new Date(project.startDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>End Date</th>
                <td>{new Date(project.endDate).toLocaleDateString()}</td>
              </tr>
              <tr>
                <th>Category</th>
                <td>
                  {Array.isArray(project.projectCategory) ? (
                    project.projectCategory.map((cat, i) => (
                      <span key={i} className="badge bg-info text-dark me-1">
                        {cat}
                      </span>
                    ))
                  ) : (
                    <span className="badge bg-info text-dark">{project.projectCategory}</span>
                  )}
                </td>
              </tr>
              {/*  */}
              <tr>
                <th>Notes</th>
                <td>{project.notes || <em>No notes</em>}</td>
              </tr>
              <tr>
                <th>Member</th>
                <td>
                  {project.addMember && project.addMember.length > 0 ? (
                    project.addMember.map((m, i) => (
                      <span key={i} className="badge bg-primary me-1">
                        {m.ename}
                      </span>
                    ))
                  ) : (
                    <span className="text-muted">Not Assigned</span>
                  )}
                </td>
              </tr>
              <tr>
                <th>Budget</th>
                <td>
                  <span className="badge bg-success">
                    ₹ {project.price?.toLocaleString()}
                  </span>
                </td>
              </tr>
              <tr>
                <th>Description</th>
                <td>{project.projectDescription || <em>No description</em>}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="card-footer text-end">
          <button className="btn btn-warning me-2" onClick={() => navigate(`/admin/getAllprojects/edit/${id}`)}>
            <i className="bi bi-pencil-square"></i> Update
          </button>
          
        </div>
      </div>
    </div>
  );
};

export default ShowProject;
