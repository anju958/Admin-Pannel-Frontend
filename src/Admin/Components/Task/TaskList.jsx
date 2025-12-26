import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

export default function TaskList() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks/all`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error("Fetch Tasks Error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleView = (id) => navigate(`/admin/task/${id}`);

  const handleAssign = () => navigate("/admin/task/assign");

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await axios.delete(`${API_URL}/api/deleteTask/${taskId}`);
      if (res.data.success) {
        alert("Task deleted!");
        fetchTasks();
      }
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // Excel Export
  const downloadExcel = () => {
    const excelData = tasks.map((t) => ({
      Task: t.title,
      Client:
        t.clientId?.clientName ||
        t.clientId?.leadName ||
        "-",
      Project: t.projectId?.projectName || "-",
      AssignedTo: t.assignedTo?.map((e) => e.ename).join(", "),
      Status: t.status,
      Priority: t.priority,
      EstimatedTime: t.estimatedTime + " min",
      TimeSpent: Math.floor((t.timeSpent || 0) / 60) + " min",
      StartDate: new Date(t.startDate).toLocaleDateString(),
      Deadline: new Date(t.dueDate).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tasks");
    XLSX.writeFile(wb, "Task_List.xlsx");
  };

  // Status chip color
  const getStatusClass = (status) => {
    if (status === "Completed") return "completed";
    if (status === "In Progress") return "progress";
    return "pending";
  };

  // Priority chip color
  const getPriorityClass = (priority) => {
    if (priority === "High") return "high";
    if (priority === "Medium") return "medium";
    return "low";
  };

  return (
    <div className="container mt-4">

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Task Management</h2>

        <div className="d-flex gap-3">
          <button className="btn btn-success btn-lg" onClick={downloadExcel}>
            ⬇️ Export Excel
          </button>

          <button className="btn btn-primary btn-lg" onClick={handleAssign}>
            ➕ Add Task
          </button>
        </div>
      </div>

      {/* Search */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search task, client, project, status..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table Container */}
      <div className="task-table-container">

        <table className="task-table">
          <thead>
            <tr>
              <th>Task</th>
              <th>Client</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Est. Time</th>
              <th>Spent</th>
              <th>Start</th>
              <th>Deadline</th>
              <th>View</th>
              <th>Delete</th>
            </tr>
          </thead>

          <tbody>
            {tasks
              .filter((t) => {
                const q = search.toLowerCase();
                return (
                  t.title?.toLowerCase().includes(q) ||
                  t.clientId?.leadName?.toLowerCase().includes(q) ||
                  t.clientId?.clientName?.toLowerCase().includes(q) ||
                  t.projectId?.projectName?.toLowerCase().includes(q) ||
                  t.status?.toLowerCase().includes(q) ||
                  t.priority?.toLowerCase().includes(q) ||
                  t.assignedTo?.some((a) =>
                    a.ename.toLowerCase().includes(q)
                  )
                );
              })
              .map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>

                  <td>
                    {task.clientId?.clientName ||
                      task.clientId?.leadName ||
                      "-"}
                  </td>

                  <td>{task.projectId?.projectName || "-"}</td>

                  <td>
                    {task.assignedTo?.length
                      ? task.assignedTo.map((e) => e.ename).join(", ")
                      : "-"}
                  </td>

                  <td>
                    <span className={`task-chip ${getStatusClass(task.status)}`}>
                      {task.status}
                    </span>
                  </td>

                  <td>
                    <span className={`task-chip ${getPriorityClass(task.priority)}`}>
                      {task.priority}
                    </span>
                  </td>

                  <td>{task.estimatedTime || 0}m</td>

                  <td>{Math.floor((task.timeSpent || 0) / 60)}m</td>

                  <td>{new Date(task.startDate).toLocaleDateString()}</td>

                  <td>
                    <b>{new Date(task.dueDate).toLocaleDateString()}</b>
                  </td>

                  <td>
                    <button
                      className="task-btn-view"
                      onClick={() => handleView(task._id)}
                    >
                      View
                    </button>
                  </td>

                  <td>
                    <button
                      className="task-btn-delete"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}

            {tasks.length === 0 && (
              <tr>
                <td colSpan="12" className="text-center py-4 text-muted">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
