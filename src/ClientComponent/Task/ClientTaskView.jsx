import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { useParams, Link } from "react-router-dom";

const ClientTaskView = () => {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/client/client-task/${taskId}`)
      .then((res) => {
        setTask(res.data.task);
        setLoading(false);
      })
      .catch((err) => {
        console.error("TASK VIEW ERROR:", err);
        setLoading(false);
      });
  }, [taskId]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ height: "60vh" }}>
        <h3 className="text-muted">Loading...</h3>
      </div>
    );

  if (!task)
    return (
      <div className="text-danger text-center mt-5 fw-bold">
        Task not found.
      </div>
    );

  // Badge color logic
  const statusColor =
    task.status === "Completed"
      ? "bg-success"
      : task.status === "In Progress"
      ? "bg-info text-dark"
      : "bg-warning text-dark";

  return (
    <div className="container mt-4">

      {/* PAGE HEADER */}
      <div
        className="p-3 mb-4"
        style={{
          background: "linear-gradient(90deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
          color: "white",
          borderRadius: "14px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        <h2 className="fw-bold m-0">{task.title}</h2>
      </div>

      {/* MAIN CARD */}
      <div
        className="shadow-lg p-4"
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* DESCRIPTION */}
        <h4 className="fw-bold mb-2">Task Description</h4>
        <p
          style={{
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
            fontSize: "1rem",
            lineHeight: "1.7",
            whiteSpace: "pre-wrap",
          }}
        >
          {task.description || "No description available."}
        </p>

        {/* INFO SECTION */}
        <div className="row mt-4">

          {/* LEFT SIDE INFO */}
          <div className="col-md-6">
            <p>
              <strong>Project:</strong>{" "}
              <span className="text-primary fw-semibold">
                {task.projectId?.projectName || "-"}
              </span>
            </p>

            <p>
              <strong>Status:</strong>{" "}
              <span
                className={`badge px-3 py-2 ${statusColor}`}
                style={{ fontSize: "0.9rem", borderRadius: "8px" }}
              >
                {task.status}
              </span>
            </p>
          </div>

          {/* RIGHT SIDE INFO */}
          <div className="col-md-6">
            <p>
              <strong>Start:</strong>{" "}
              {task.startDate ? new Date(task.startDate).toLocaleDateString() : "-"}
            </p>

            <p>
              <strong>Deadline:</strong>{" "}
              {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}
            </p>
          </div>

        </div>

        {/* COMMENTS SECTION */}
        <hr className="my-4" />

        <h4 className="fw-bold mb-3">Comments</h4>

        {task.comments?.length ? (
          <div className="list-group">
            {task.comments.map((c, i) => (
              <div
                key={i}
                className="list-group-item mb-2"
                style={{
                  borderRadius: "10px",
                  background: "#fafafa",
                  border: "1px solid #eee",
                }}
              >
                {c.text}
                <br />
                <small className="text-muted">
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted">No comments available for this task.</p>
        )}

        {/* BACK BUTTON */}
        <Link
          to="/client/tasks"
          className="btn btn-secondary mt-4 px-4"
          style={{
            borderRadius: "10px",
            fontWeight: "600",
            padding: "10px 22px",
          }}
        >
          ← Back
        </Link>
      </div>
    </div>
  );
};

export default ClientTaskView;
