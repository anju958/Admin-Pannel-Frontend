// src/pages/admin/TaskList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../../config";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("/api/tasks")
      .then(res => setTasks(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>All Tasks</h3>
        <button
          className="btn btn-primary"
          onClick={() => navigate("/admin/TaskList/assignTask")}
        >
          ➕ Assign New Task
        </button>
      </div>

      <div className="card shadow-sm p-3">
        <table className="table table-hover">
          <thead className="table-light">
            <tr>
              <th>Title</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.category}</td>
                  <td>
                    <span className={`badge bg-${
                      task.priority === "High" ? "danger" :
                      task.priority === "Medium" ? "warning" : "secondary"
                    }`}>
                      {task.priority}
                    </span>
                  </td>
                  <td>
                    {task.assignedTo?.map(emp => emp.name).join(", ")}
                  </td>
                  <td>{new Date(task.deadline).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge bg-${
                      task.status === "Completed" ? "success" :
                      task.status === "In Progress" ? "info" : "secondary"
                    }`}>
                      {task.status}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center text-muted">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TaskList;
