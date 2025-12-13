import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const [task, setTask] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/details/${taskId}`)
      .then((res) => setTask(res.data))
      .catch((err) => console.log(err));
  }, [taskId]);

  if (!task) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div className="container mt-4">
      <h3 className="fw-bold mb-4">📌 Task Details</h3>

      <div className="card shadow-sm p-4">

        {/* TASK TITLE */}
        <h4 className="fw-bold mb-3">{task.taskTitle}</h4>

        {/* GRID LAYOUT */}
        <div className="row">
          
          <div className="col-md-6 mb-3">
            <label className="fw-bold">Project:</label>
            <div className="text-secondary">{task.projectName}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-bold">Assigned To:</label>
            <div>
              {task.assignedTo?.length > 0 ? (
                task.assignedTo.map((u) => (
                  <span key={u.id} className="badge bg-primary me-2 p-2">
                    {u.name}
                  </span>
                ))
              ) : (
                <span className="text-muted">Not Assigned</span>
              )}
            </div>
          </div>

          <div className="col-md-12 mb-3">
            <label className="fw-bold">Description:</label>
            <div className="text-secondary">{task.description}</div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-bold">Start Date:</label>
            <div className="text-secondary">
              {new Date(task.startDate).toLocaleString()}
            </div>
          </div>

          <div className="col-md-6 mb-3">
            <label className="fw-bold">Deadline:</label>
            <div className="text-secondary">
              {new Date(task.deadline).toLocaleString()}
            </div>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-bold">Status:</label><br />
            <span className={`badge p-2 bg-${task.status === "Completed" ? "success" : task.status === "In Progress" ? "warning text-dark" : "secondary"}`}>
              {task.status}
            </span>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-bold">Priority:</label><br />
            <span className="badge bg-info p-2">{task.priority}</span>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-bold">Estimated Time:</label>
            <div className="text-secondary">{task.estimatedTime} secs</div>
          </div>

          <div className="col-md-4 mb-3">
            <label className="fw-bold">Time Spent:</label>
            <div className="text-secondary">{task.timeSpent} secs</div>
          </div>

          <div className="col-md-12 mb-3">
            <label className="fw-bold">Reason (If Incomplete):</label>
            <div className="text-secondary">{task.incompleteReason || "—"}</div>
          </div>

        </div>

        {/* COMMENTS SECTION */}
        <hr />
        <h5 className="fw-bold mt-3">💬 Comments</h5>

        {task.comments.length === 0 ? (
          <p className="text-muted">No comments available</p>
        ) : (
          <ul className="list-group">
            {task.comments.map((c) => (
              <li key={c._id} className="list-group-item d-flex justify-content-between">
                <span>{c.text}</span>
                <small className="text-muted">
                  {new Date(c.createdAt).toLocaleString()}
                </small>
              </li>
            ))}
          </ul>
        )}

        {/* TIME LOGS SECTION */}
        <hr />
        <h5 className="fw-bold mt-3">⏱ Time Logs</h5>

        {task.timeLogs.length === 0 ? (
          <p className="text-muted">No time logs added</p>
        ) : (
          <ul className="list-group">
            {task.timeLogs.map((log, index) => (
              <li key={index} className="list-group-item">
                <strong>Start:</strong> {new Date(log.startAt).toLocaleString()} <br />
                <strong>End:</strong> {new Date(log.endAt).toLocaleString()} <br />
                <strong>Duration:</strong> {log.duration} secs
              </li>
            ))}
          </ul>
        )}

      </div>
    </div>
  );
}
