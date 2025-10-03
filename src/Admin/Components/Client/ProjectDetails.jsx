

import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

function ProjectDetails() {
  const { clientId, projectId } = useParams();
  const [project, setProject] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5000/api/getProjectById/${clientId}/${projectId}`)
      .then((res) => setProject(res.data))
      .catch((err) => console.error("Error fetching project:", err));
  }, [clientId, projectId]);

  if (!project) {
    return <p className="text-center mt-5">⏳ Loading project details...</p>;
  }

  return (
    <div className="container mt-4">
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="text-primary">
          📌 {project.projectName}
        </h2>
        <Link  to={`/admin/projects`} 
  state={{ client: project.clientId }}  className="btn btn-outline-secondary">
          ⬅ Back to Projects
        </Link>
      </div>

      {/* Card */}
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-body">
          {/* Client & Department */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-muted">👤 Client</h6>
              <p className="fw-bold">{project.clientId?.leadName || "N/A"}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">🏢 Department</h6>
              <p className="fw-bold">{project.department?.deptName || "N/A"}</p>
            </div>
          </div>

          {/* Service & Budget */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-muted">🛠 Service</h6>
              <p className="fw-bold">{project.service?.serviceName || "N/A"}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">💰 Budget</h6>
              <p className="fw-bold text-success">₹{project.price}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="row mb-4">
            <div className="col-md-6">
              <h6 className="text-muted">📅 Start Date</h6>
              <p className="fw-bold">{new Date(project.startDate).toLocaleDateString()}</p>
            </div>
            <div className="col-md-6">
              <h6 className="text-muted">📅 End Date</h6>
              <p className="fw-bold">{new Date(project.endDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Description */}
          <div className="mb-4">
            <h6 className="text-muted">📖 Project Description</h6>
            <p>{project.projectDescription || "No description available."}</p>
          </div>

          {/* Notes */}
          <div className="mb-4">
            <h6 className="text-muted">🗒 Notes</h6>
            <p>{project.notes || "No notes available."}</p>
          </div>

          {/* File */}
          {project.addFile && (
            <div className="mb-4">
              <h6 className="text-muted">📂 Attached File</h6>
              <a
                href={`http://localhost:5000/uploads/projects/${project.addFile}`}
                target="_blank"
                rel="noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                View File
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectDetails;
