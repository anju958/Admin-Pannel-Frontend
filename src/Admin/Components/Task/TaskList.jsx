import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx"; // ✅ Excel Export
import { API_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

const TaskList = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState(""); // ✅ SEARCH

  // =======================
  // Fetch All Tasks
  // =======================
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks/all`);
      setTasks(res.data.tasks || []);
    } catch (error) {
      console.error("Fetch Tasks Error:", error);
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

  const statusColor = (status) => {
    if (status === "Completed") return "success";
    if (status === "In Progress") return "info";
    return "secondary";
  };

  const priorityColor = (priority) => {
    if (priority === "High") return "danger";
    if (priority === "Medium") return "warning";
    return "secondary";
  };

  // =======================
  // ✅ Excel Download
  // =======================
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

  return (
    <div className="container mt-4">

      {/* =======================
           Top Header
      ======================= */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">All Tasks</h2>

        <div className="d-flex gap-3">
          {/* Excel Button */}
          <button
            className="btn btn-success btn-lg"
            style={{ borderRadius: "10px" }}
            onClick={downloadExcel}
          >
            ⬇️ Download Excel
          </button>

          {/* Assign Task Button */}
          <button
            className="btn btn-primary btn-lg"
            onClick={handleAssign}
            style={{ borderRadius: "10px" }}
          >
            ➕ Assign New Task
          </button>
        </div>
      </div>

      {/* =======================
           Search Box
      ======================= */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search task..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* =======================
           Table
      ======================= */}
      <div className="card shadow-lg border-0 p-3" style={{ borderRadius: "15px" }}>
        <table className="table table-hover align-middle text-center">
          <thead className="table-dark">
            <tr>
              <th>Task</th>
              <th>Client</th>
              <th>Project</th>
              <th>Assigned To</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Est. Time</th>
              <th>Time Spent</th>
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

                  <td className="fw-bold">{task.title}</td>

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
                    <span className={`badge bg-${statusColor(task.status)} px-3 py-2`}>
                      {task.status}
                    </span>
                  </td>

                  <td>
                    <span className={`badge bg-${priorityColor(task.priority)} px-3 py-2`}>
                      {task.priority}
                    </span>
                  </td>

                  <td>{task.estimatedTime || 0} min</td>

                  <td>{Math.floor((task.timeSpent || 0) / 60)} min</td>

                  <td>{new Date(task.startDate).toLocaleDateString()}</td>

                  <td>
                    <strong>{new Date(task.dueDate).toLocaleDateString()}</strong>
                  </td>

                  <td>
                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => handleView(task._id)}
                    >
                      View
                    </button>
                  </td>

                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(task._id)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>
              ))}

            {tasks.length === 0 && (
              <tr>
                <td colSpan="12" className="text-muted py-4 fs-5">
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
