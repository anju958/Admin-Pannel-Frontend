import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import Select from "react-select";

const TaskView = () => {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [adminMessage, setAdminMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState([]);
  const [adminMessages, setAdminMessages] = useState([]);

  const [commentText, setCommentText] = useState("");

  const [form, setForm] = useState({
    title: "",
    status: "",
    priority: "",
    startDate: "",
    dueDate: "",
    assignedToArray: [],
  });

  useEffect(() => {
    loadEmployees();
    loadTask();
  }, []);

  // ================================
  // Load All Employees
  // ================================
  const loadEmployees = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getemployeeData`);
      setEmployees(res.data || []);
    } catch (err) {
      console.error("EMPLOYEE LOAD ERROR:", err);
    }
  };

  const loadAdminMessages = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/api/tasks/adminMessages/${taskId}`
      );
      setAdminMessages(res.data || []);
    } catch (err) {
      console.error("ADMIN MESSAGE LOAD ERROR:", err);
    }
  };

  useEffect(() => {
    loadEmployees();
    loadTask();
    loadAdminMessages();   // 👈 ADD THIS
  }, []);
  // ================================
  // Load Task
  // ================================
  const loadTask = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks/view/${taskId}`);

      const t = res.data.task;
      setTask(t);

      setForm({
        title: t?.title || "",
        status: t?.status || "Pending",
        priority: t?.priority || "Low",
        startDate: t?.startDate ? t.startDate.split("T")[0] : "",
        dueDate: t?.dueDate ? t.dueDate.split("T")[0] : "",
        assignedToArray: t?.assignedTo?.map((u) => u._id) || [],
      });

      setLoading(false);
    } catch (err) {
      console.error("TASK LOAD ERROR:", err);
      setLoading(false);
    }
  };


  const notifyEmployees = async () => {
    try {
      await axios.post(
        `${API_URL}/api/tasks/notify/${task._id}`,
        { message: adminMessage }
      );

      alert("Employee notified successfully");
      setAdminMessage("");

      loadAdminMessages(); // 👈 refresh list
    } catch (err) {
      console.error(err);
      alert("Failed to notify employee");
    }
  };

  // ================================
  // Update Task
  // ================================
  const updateTask = async () => {
    try {
      await axios.put(`${API_URL}/api/UpdateTask/${taskId}`, {
        title: form.title,
        status: form.status,
        priority: form.priority,
        startDate: form.startDate,
        dueDate: form.dueDate,
        assignedTo: form.assignedToArray,
      });

      alert("Task updated!");
      loadTask();
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  // ================================
  // Notify Employee
  // ================================
  const notifyEmployee = async () => {
    try {
      await axios.post(`${API_URL}/api/notifyTask`, { taskId });
      alert("Notification Sent!");
    } catch (err) {
      console.error(err);
      alert("Failed to send notification");
    }
  };

  // ================================
  // Add Comment
  // ================================
  const addComment = async () => {
    if (!commentText.trim()) return;

    try {
      await axios.post(`${API_URL}/api/comment/${taskId}`, {
        userId: localStorage.getItem("employeeId") || "admin",
        text: commentText,
      });

      setCommentText("");
      loadTask();
    } catch (err) {
      console.error(err);
      alert("Failed to add comment");
    }
  };

  if (loading) return <h3 className="text-center mt-5">Loading...</h3>;
  if (!task) return <h3 className="text-center mt-5">Task not found</h3>;

  console.log(employees)
  return (
    <div className="container mt-4">

      {/* Top Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>
          {task?.projectId?.projectName} — {task?.TaskId}
        </h3>

        <div>
          <button className="btn btn-secondary me-2" onClick={() => navigate(-1)}>Back</button>

        </div>
      </div>

      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-md-8">

          {/* DETAILS */}
          <div className="card mb-4">
            <div className="card-header bg-dark text-white">Details</div>
            <div className="card-body">
              <p><strong>Project:</strong> {task?.projectId?.projectName}</p>
              <p><strong>Client:</strong> {task?.clientId?.leadName}</p>
              <p><strong>Service:</strong> {task?.serviceId?.serviceName}</p>
              <p><strong>Category:</strong> {task?.category}</p>
              <p><strong>Description:</strong> {task?.description}</p>
            </div>
          </div>

          {/* ASSIGNED EMPLOYEES */}
          <div className="card mb-4">
            <div className="card-header">Assigned To</div>
            {/* <div className="card-body">
              {task?.assignedTo?.map((u) => u.ename).join(", ")}
            </div> */}
            <div style={{ position: "relative", zIndex: 9999 }}>
              <Select
                isMulti
                menuPortalTarget={document.body}
                styles={{
                  menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                  menu: (base) => ({ ...base, zIndex: 99999 }),
                }}

                /* ✅ SAFE OPTIONS */
                options={employees
                  .filter((e) => e && e._id && typeof e.ename === "string")
                  .map((e) => ({
                    value: e._id,
                    label: e.ename, // always string now
                  }))
                }

                /* ✅ SAFE VALUE */
                value={employees
                  .filter(
                    (e) =>
                      e &&
                      e._id &&
                      typeof e.ename === "string" &&
                      form.assignedToArray.includes(e._id)
                  )
                  .map((e) => ({
                    value: e._id,
                    label: e.ename,
                  }))
                }

                onChange={(selected = []) =>
                  setForm({
                    ...form,
                    assignedToArray: selected.map((s) => s.value),
                  })
                }

                /* ✅ EXTRA SAFETY (prevents future crashes) */
                filterOption={(option, input) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

          </div>

          {/* TIME LOGS */}
          <div className="card mb-4">
            <div className="card-header">Time Logs</div>
            <div className="card-body">
              <p><strong>Total time spent:</strong> {Math.floor((task?.timeSpent || 0) / 60)} min</p>
              {task?.timeLogs?.length !== 0 ? (
                <ul className="list-group">
                  {task.timeLogs.map((l, i) => (
                    <li key={i} className="list-group-item">
                      {new Date(l.startAt).toLocaleString()} →{" "}
                      {l.endAt ? new Date(l.endAt).toLocaleString() : "Running"}
                      <br />
                      Duration: {Math.floor((l.duration || 0) / 60)} min
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No logs available</p>
              )}
            </div>
          </div>

          {/* COMMENTS */}
          <div className="card mb-4">
            <div className="card-header">Comments</div>

            <div className="card mb-4">
              <div className="card-header bg-info text-white">
                Admin Message to Employee
              </div>

              <div className="card-body">
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Write message for employee..."
                  value={adminMessage}
                  onChange={(e) => setAdminMessage(e.target.value)}
                />

                <button
                  className="btn btn-info mt-2"
                  onClick={notifyEmployees}
                  disabled={!adminMessage.trim()}
                >
                  Notify Employee
                </button>
              </div>
            </div>

            {/* ADMIN MESSAGE HISTORY */}
            <div className="card mb-4">
              <div className="card-header bg-secondary text-white">
                Admin Messages (Sent to Employee)
              </div>

              <div className="card-body">
                {adminMessages.length === 0 ? (
                  <p className="text-muted">No admin messages sent yet.</p>
                ) : (
                  adminMessages.map((m) => (
                    <div key={m._id} className="border rounded p-2 mb-2">
                      <strong>{m.user?.ename || "Admin"}</strong>
                      <small className="ms-2 text-muted">
                        ({new Date(m.createdAt).toLocaleString()})
                      </small>

                      <p className="mt-1 mb-0">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>


          </div>

        </div>

        {/* RIGHT SIDE — QUICK UPDATE */}
        <div className="col-md-4">
          <div className="card mb-4">
            <div className="card-header bg-primary text-white">Quick Update</div>

            <div className="card-body">

              <label>Title</label>
              <input
                className="form-control mb-2"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />

              <label>Status</label>
              <select
                className="form-select mb-2"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option>Pending</option>
                <option>In Progress</option>
                <option>Completed</option>
              </select>

              <label>Priority</label>
              <select
                className="form-select mb-2"
                value={form.priority}
                onChange={(e) => setForm({ ...form, priority: e.target.value })}
              >
                <option>Low</option>
                <option>Medium</option>
                <option>High</option>
              </select>

              <label>Start Date</label>
              <input
                type="date"
                className="form-control mb-2"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />

              <label>Due Date</label>
              <input
                type="date"
                className="form-control mb-2"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />

              {/* SELECT FIELD FIXED WITH PROPER DROPDOWN */}
              <label>Assigned To</label>
              <div style={{ position: "relative", zIndex: 9999 }}>
                <Select
                  isMulti
                  menuPortalTarget={document.body}
                  styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 99999 }),
                    menu: (base) => ({ ...base, zIndex: 99999 }),
                  }}
                  value={employees
                    .filter((e) => form.assignedToArray.includes(e._id))
                    .map((e) => ({ value: e._id, label: e.ename }))
                  }
                  options={employees.map((e) => ({
                    value: e._id,
                    label: e.ename,
                  }))}
                  onChange={(selected) =>
                    setForm({
                      ...form,
                      assignedToArray: selected.map((s) => s.value),
                    })
                  }
                />
              </div>

              <button className="btn btn-success w-100 mt-3" onClick={updateTask}>
                Save
              </button>
            </div>
          </div>

          {/* META BLOCK */}
          <div className="card">
            <div className="card-header bg-dark text-white">Meta</div>
            <div className="card-body">
              <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(task.updatedAt).toLocaleString()}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default TaskView;
