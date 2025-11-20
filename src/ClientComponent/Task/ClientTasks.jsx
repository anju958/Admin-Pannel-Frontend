import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";

const ClientTasks = () => {
  const client = JSON.parse(localStorage.getItem("clientUser") || "null");
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (!client?._id) return;

    axios
      .get(`${API_URL}/api/client/client-tasks/${client._id}`)
      .then((res) => setTasks(res.data.tasks || []))
      .catch((err) => console.error("TASK API ERROR:", err));
  }, [client]);

  return (
    <div className="container mt-4">

      {/* Gradient Header */}
      <div
        className="p-3 mb-4"
        style={{
          background: "linear-gradient(90deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
          color: "white",
          borderRadius: "14px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h2 className="fw-bold m-0">Client Tasks</h2>
      </div>

      {tasks.length === 0 && (
        <div className="alert alert-info fs-5 text-center">No tasks available.</div>
      )}

      {/* Task List */}
      <div className="mt-3">
        {tasks.map((t) => {
          const statusColor =
            t.status === "Completed"
              ? "bg-success"
              : t.status === "In Progress"
              ? "bg-info text-dark"
              : "bg-warning text-dark";

          return (
            <div
              key={t._id}
              className="shadow task-card mb-3"
              style={{
                background: "white",
                padding: "20px",
                borderRadius: "12px",
                transition: "0.2s",
                borderLeft: "6px solid #6A11CB",
              }}
            >
              <div className="d-flex justify-content-between align-items-center">

                {/* LEFT */}
                <div style={{ maxWidth: "75%" }}>
                  <h4 className="fw-bold text-dark">{t.title}</h4>

                  <div className="text-muted" style={{ fontSize: "0.95rem" }}>
                    {t.projectId?.projectName}
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-end">
                  <span
                    className={`badge px-3 py-2 ${statusColor}`}
                    style={{
                      fontSize: "0.85rem",
                      borderRadius: "8px",
                      marginRight: "12px",
                    }}
                  >
                    {t.status}
                  </span>

                  <Link
                    to={`/client/task/${t._id}`}
                    className="btn btn-primary"
                    style={{
                      borderRadius: "8px",
                      fontWeight: "600",
                      padding: "7px 18px",
                    }}
                  >
                    View →
                  </Link>
                </div>

              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ClientTasks;
