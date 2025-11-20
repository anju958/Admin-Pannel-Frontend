import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

function ClientProjectsPage() {
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);

  // Load client
  useEffect(() => {
    const c = localStorage.getItem("clientUser");
    if (c) setClient(JSON.parse(c));
  }, []);

  // Fetch projects
  useEffect(() => {
    if (!client?._id) return;

    axios
      .get(`${API_URL}/api/client/client-projects/${client._id}`)
      .then((res) => {
        setProjects(res.data.projects || []);
      })
      .catch((err) => console.error("Error fetching projects:", err));
  }, [client]);

  return (
    <div className="container mt-4">

      {/* PAGE TITLE */}
      <h2 className="fw-bold mb-4" style={{ fontSize: "2rem" }}>
        My Projects
      </h2>

      {/* CARD CONTAINER */}
      <div
        className="shadow p-4"
        style={{
          borderRadius: "12px",
          background: "white",
          overflowX: "auto",
        }}
      >
        {projects.length === 0 ? (
          <p className="text-muted text-center py-4 fs-5">
            No projects found.
          </p>
        ) : (
          <table
            className="table table-hover align-middle"
            style={{ minWidth: "900px" }}
          >
            <thead className="table-dark">
              <tr>
                <th>Project</th>
                <th>Service</th>
                <th>Department</th>
                <th>Status</th>
                <th>Start</th>
                <th>End</th>
                <th>View</th>
              </tr>
            </thead>

            <tbody>
              {projects.map((p) => {
                const statusColor =
                  p.status === "Completed"
                    ? "bg-success"
                    : p.status === "In Progress"
                    ? "bg-info text-dark"
                    : "bg-warning text-dark";

                return (
                  <tr key={p._id}>
                    <td>
                      <b>{p.projectName}</b>
                    </td>
                    <td>{p.service?.serviceName}</td>
                    <td>{p.department?.departmentName}</td>

                    {/* STATUS BADGE */}
                    <td>
                      <span
                        className={`badge ${statusColor}`}
                        style={{ padding: "8px 12px", fontSize: "0.9rem" }}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td>{p.startDate?.split("T")[0]}</td>
                    <td>{p.endDate?.split("T")[0]}</td>

                    <td>
                      <a
                        href={`/client/project/${p._id}`}
                        className="btn btn-primary btn-sm"
                        style={{ borderRadius: "8px", padding: "6px 15px" }}
                      >
                        View
                      </a>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default ClientProjectsPage;
