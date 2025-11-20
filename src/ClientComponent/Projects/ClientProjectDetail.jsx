import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { useParams, Link } from "react-router-dom";

function ClientProjectDetail() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/client/client-project/${projectId}`)
      .then((res) => {
        setProject(res.data.project);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading project:", err);
        setLoading(false);
      });
  }, [projectId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center mt-5">
        <h3 className="text-muted">Loading...</h3>
      </div>
    );

  if (!project)
    return (
      <div className="text-center mt-5 text-danger fw-bold">
        Project not found.
      </div>
    );

  // Badge colors
  const statusColor =
    project.status === "Completed"
      ? "bg-success"
      : project.status === "In Progress"
      ? "bg-info text-dark"
      : "bg-warning text-dark";

  return (
    <div className="container mt-4">

      {/* Outer card */}
      <div
        className="shadow p-4 border-0"
        style={{ borderRadius: "15px", background: "#fff" }}
      >
        
        {/* Title */}
        <h2 className="fw-bold mb-3" style={{ fontSize: "2rem" }}>
          {project.projectName}
        </h2>

        <div className="row mt-4">

          {/* LEFT COLUMN */}
          <div className="col-md-6 mb-4">
            <p>
              <strong>Service:</strong>{" "}
              <span className="badge bg-primary px-3 py-2">
                {project.service?.serviceName || "N/A"}
              </span>
            </p>

            <p>
              <strong>Department:</strong>{" "}
              <span className="badge bg-secondary px-3 py-2">
                {project.department?.departmentName || "N/A"}
              </span>
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span className={`badge px-3 py-2 ${statusColor}`}>
                {project.status}
              </span>
            </p>

            <p className="mt-4">
              <strong>Start Date:</strong>{" "}
              {project.startDate?.split("T")[0] || "-"}
            </p>

            <p>
              <strong>End Date:</strong>{" "}
              {project.endDate?.split("T")[0] || "-"}
            </p>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-md-6">
            <strong>Description:</strong>
            <div
              className="p-3 mt-2"
              style={{
                background: "#f8f9fa",
                borderRadius: "10px",
                minHeight: "120px",
                whiteSpace: "pre-wrap",
              }}
            >
              {project.projectDescription || "No description provided."}
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* MEMBERS */}
        <h4 className="fw-bold mb-3">Project Members</h4>

        {project.addMember?.length > 0 ? (
          <div className="list-group">
            {project.addMember.map((m) => (
              <div
                key={m._id}
                className="list-group-item d-flex justify-content-between align-items-center"
                style={{
                  borderRadius: "8px",
                  marginBottom: "8px",
                  border: "1px solid #eee",
                }}
              >
                <span>
                  <strong>{m.ename}</strong>
                  <br />
                  <span className="text-muted">{m.email}</span>
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No members assigned.</p>
        )}

        {/* BACK BUTTON */}
        <Link
          to="/client/projects"
          className="btn btn-secondary mt-4 px-4"
          style={{ borderRadius: "10px", fontWeight: "600" }}
        >
          ← Back
        </Link>
      </div>
    </div>
  );
}

export default ClientProjectDetail;
