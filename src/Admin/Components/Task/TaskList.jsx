import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import Select from "react-select";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";

const socket = io("http://localhost:5000", { transports: ["websocket"] });



const TaskList = () => {
   const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    priority: "Low",
    status: "Pending",
    assignedTo: [],
  });

  // Fetch all tasks
  const fetchTasks = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getAllTasks`);
      setTasks(res.data.tasks || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTasks();

    // Listen for socket notifications
    socket.on("connect", () => {
      console.log("✅ Connected to notification server");
    });

    socket.on("newNotification", (data) => {
      console.log("🔔 New Notification Received:", data);
      alert(`🔔 ${data.message}`);
    });

    // Cleanup socket connection when component unmounts
    return () => {
      socket.off("newNotification");
    };
  }, []);


  // Open update modal
  const handleUpdate = async (task) => {
    setCurrentTask(task);
    setFormData({
      title: task.title,
      description: task.description || "",
      category: task.category,
      priority: task.priority || "Low",
      status: task.status,
      assignedTo: task.assignedTo?.map((e) => e._id) || [],
    });

    // Fetch employees for this project
    if (task.projectId) {
      try {
        const empRes = await axios.get(
          `${API_URL}/api/getEmployeeByProject/${task.projectId}`
        );
        setEmployees(empRes.data.employees || []);
      } catch (err) {
        console.error(err);
      }
    }

    setShowUpdateModal(true);
  };

  // Submit update
  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/updateTask/${currentTask._id}`, formData);
      alert("Task updated successfully!");
      setShowUpdateModal(false);
      fetchTasks();
    } catch (err) {
      console.error(err);
      alert("Failed to update task.");
    }
  };

  // Delete task
 
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await axios.delete(`${API_URL}/api/deleteTask/${taskId}`);

      if (res.status === 200) {
        alert("✅ Task deleted successfully!");
        fetchTasks(); // Refresh the task list
      } else {
        alert("⚠️ Failed to delete task.");
      }
    } catch (err) {
      console.error("Delete task error:", err.response || err);
      const msg = err.response?.data?.message || "Failed to delete task.";
      alert(`❌ ${msg}`);
    }
  };


  // Notify assigned employees
  const handleNotify = async (task) => {
    console.log("Notify TaskId:", task._id); // <-- check this
    try {
      await axios.post(`${API_URL}/api/notifyTask`, { taskId: task._id });
      alert("Notification sent to assigned employees!");
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert("Failed to send notification.");
    }
  };

  const handleAssignTask = () => {
    navigate("/admin/TaskList/assignTask"); // <-- navigate to this route
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>All Tasks</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={handleAssignTask}
        >
          ➕ Assign New Task
        </button>
      </div>

      <div className="card shadow-sm p-3">
        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Employee Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task) => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description || "-"}</td>
                  <td>{task.category}</td>
                  <td>
                    <span
                      className={`badge bg-${task.priority === "High"
                        ? "danger"
                        : task.priority === "Medium"
                          ? "warning"
                          : "secondary"
                        }`}
                    >
                      {task.priority || "Low"}
                    </span>
                  </td>
                  <td>{task.assignedTo?.map((e) => e.ename).join(", ")}</td>
                  <td>{new Date(task.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge bg-${task.status === "Completed"
                        ? "success"
                        : task.status === "In Progress"
                          ? "info"
                          : "secondary"
                        }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>{task.employeeUpdate || "No updates"}</td>
                  <td>
                    <div className="d-flex flex-wrap gap-1 justify-content-center">
                      <button
                        className="btn btn-primary btn-sm py-1 px-2"
                        onClick={() => handleUpdate(task)}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-info btn-sm py-1 px-2"
                        onClick={() => handleNotify(task)}
                      >
                        Notify
                      </button>
                      <button
                        className="btn btn-danger btn-sm py-1 px-2"
                        onClick={() => handleDelete(task._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No tasks found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Update Modal */}
      {showUpdateModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handleUpdateSubmit}>
                <div className="modal-header">
                  <h5 className="modal-title">Update Task</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowUpdateModal(false)}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      rows="3"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Priority</label>
                    <select
                      className="form-select"
                      value={formData.priority}
                      onChange={(e) =>
                        setFormData({ ...formData, priority: e.target.value })
                      }
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium</option>
                      <option value="High">High</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Status</label>
                    <select
                      className="form-select"
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>
                  </div>

                  <div className="mb-3">
                    <label className="form-label">Assign Employees</label>
                    <Select
                      isMulti
                      options={employees.map((e) => ({
                        value: e._id,
                        label: e.ename,
                      }))}
                      value={employees
                        .filter((e) => formData.assignedTo.includes(e._id))
                        .map((e) => ({ value: e._id, label: e.ename }))}
                      onChange={(selected) =>
                        setFormData({
                          ...formData,
                          assignedTo: selected.map((s) => s.value),
                        })
                      }
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowUpdateModal(false)}
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-primary btn-sm">
                    Update Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskList;
