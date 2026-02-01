

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { useNavigate } from "react-router-dom";

/* ------------------ FORMAT TIME ------------------ */
const formatMinutes = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const rmins = mins % 60;
  return hrs > 0 ? `${hrs}h ${rmins}m` : `${rmins}m`;
};

export default function EmployeeTask() {
  const navigate = useNavigate();
  const intervalsRef = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------- STATUS MODAL STATE -------- */
  const [showModal, setShowModal] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);
  const [statusForm, setStatusForm] = useState({
    status: "",
    reason: "",
    progress: "",
    file: null,
  });

  /* ---------------- FILTER STATE ---------------- */
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState("all");

  /* ---------------- USER ---------------- */
  const employeeLocal = JSON.parse(localStorage.getItem("user"));
  const employeeId = employeeLocal?.employeeId;

  /* ---------------- FETCH TASKS ---------------- */
  const fetchTasks = async () => {
    if (!employeeId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/tasks/employee/${employeeId}`
      );

      const rawTasks = res.data.tasks || [];

      const runningTask = rawTasks.find((t) => {
        const last =
          t.timeLogs?.length > 0
            ? t.timeLogs[t.timeLogs.length - 1]
            : null;
        return last && !last.endAt;
      });

      const prepared = rawTasks.map((t) => {
        const last =
          t.timeLogs?.length > 0
            ? t.timeLogs[t.timeLogs.length - 1]
            : null;

        return {
          ...t,
          running:
            runningTask &&
            runningTask._id === t._id &&
            last &&
            !last.endAt,
          liveSeconds: 0,
        };
      });

      setTasks(prepared);
    } catch (err) {
      console.error("Task fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };


  const submitCompletedDirectly = async (task) => {
    try {
      await axios.patch(
        `${API_URL}/api/tasks/TaskStatus/${task._id}`,
        { status: "Completed" }
      );

      fetchTasks();
    } catch (err) {
      alert("Failed to mark task as completed");
    }
  };
  // helper function 
  const getStatusInfo = (task) => {
    // 1️⃣ Latest status update
    const lastStatus =
      task.statusHistory?.length > 0
        ? task.statusHistory[task.statusHistory.length - 1]
        : null;

    // 2️⃣ Latest comment
    const lastComment =
      task.comments?.length > 0
        ? task.comments[task.comments.length - 1]
        : null;

    // Pending → show reason
    if (task.status === "Pending" && lastStatus?.reason) {
      return `Reason: ${lastStatus.reason}`;
    }

    // In Progress → show progress + reason
    if (task.status === "In Progress") {
      let text = "";
      if (lastStatus?.progress) {
        text += `Progress: ${lastStatus.progress}%`;
      }
      if (lastStatus?.reason) {
        text += text ? ` | ${lastStatus.reason}` : lastStatus.reason;
      }
      return text || "Work in progress";
    }

    // Completed
    if (task.status === "Completed") {
      return "Completed";
    }

    // Fallback to comment
    if (lastComment?.text) {
      return `Comment: ${lastComment.text}`;
    }

    return "-";
  };



  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    fetchTasks();
  }, [employeeId]);

  /* ---------------- LIVE TIMER ---------------- */
  useEffect(() => {
    intervalsRef.current = setInterval(() => {
      setTasks((prev) =>
        prev.map((t) => {
          if (!t.running) return t;

          const last = t.timeLogs[t.timeLogs.length - 1];
          const liveSeconds = Math.floor(
            (Date.now() - new Date(last.startAt)) / 1000
          );

          return { ...t, liveSeconds };
        })
      );
    }, 1000);

    return () => clearInterval(intervalsRef.current);
  }, []);

  /* ---------------- AUTO STOP ON CLOSE ---------------- */
  useEffect(() => {
    const autoStop = () => {
      if (!employeeId) return;
      navigator.sendBeacon(
        `${API_URL}/api/tasks/autoStopTimer/${employeeId}`
      );
    };

    window.addEventListener("beforeunload", autoStop);
    window.addEventListener("unload", autoStop);

    return () => {
      window.removeEventListener("beforeunload", autoStop);
      window.removeEventListener("unload", autoStop);
    };
  }, [employeeId]);

  /* ---------------- START / STOP TIMER ---------------- */
  const startTimer = async (task) => {
    try {
      await axios.post(`${API_URL}/api/tasks/timerStart/${task._id}`);
      fetchTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Cannot start timer");
    }
  };

  const stopTimer = async (task) => {
    try {
      await axios.post(`${API_URL}/api/tasks/stopTimer/${task._id}`);
      fetchTasks();
    } catch (err) {
      alert(err?.response?.data?.message || "Cannot stop timer");
    }
  };

  /* ---------------- STATUS MODAL ---------------- */
  const openStatusModal = (task, status) => {
    setCurrentTask(task);
    setStatusForm({ status, reason: "", progress: "", file: null });
    setShowModal(true);
  };

  const submitStatus = async () => {
    if (!currentTask?._id) {
      alert("Task not selected");
      return;
    }
    const form = new FormData();
    form.append("status", statusForm.status);
    form.append("reason", statusForm.reason);
    if (statusForm.progress) form.append("progress", statusForm.progress);
    if (statusForm.file) form.append("attachment", statusForm.file);

    await axios.patch(
      `${API_URL}/api/tasks/TaskStatus/${currentTask._id}`,
      form
    );

    setShowModal(false);
    fetchTasks();
  };

  const openTask = (id) => navigate(`/employee/TaskView/${id}`);

  /* ---------------- FILTER ---------------- */
  const filteredTasks = tasks.filter((t) => {
    const date = new Date(t.startDate || t.updatedAt);
    if (isNaN(date)) return false;
    if (Number(year) !== date.getFullYear()) return false;
    if (month !== "all" && Number(month) !== date.getMonth() + 1) return false;
    return true;
  });

  if (loading) return <div className="p-4 text-center">Loading tasks...</div>;

  /* ---------------- UI ---------------- */
  return (
    <div className="container mt-3">
      <h3 className="mb-3">My Tasks</h3>

      {/* -------- FILTERS -------- */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-select"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            {[now.getFullYear(), now.getFullYear() - 1, now.getFullYear() - 2].map(
              (y) => (
                <option key={y} value={y}>{y}</option>
              )
            )}
          </select>
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            {[...Array(12)].map((_, i) => (
              <option key={i} value={i + 1}>
                {new Date(0, i).toLocaleString("default", { month: "long" })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -------- TABLE (UNCHANGED) -------- */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Task</th>
              <th>Project</th>
              <th>Priority</th>
              <th>Due Date</th>
              <th>Time Spent</th>
              <th>Status</th>
              <th>Status Action</th>
              <th>Actions</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="10" className="text-center text-muted">
                  No tasks found
                </td>
              </tr>
            )}

            {filteredTasks.map((t, index) => (
              <tr key={t._id}>
                <td>{index + 1}</td>
                <td>{t.title}</td>
                <td>{t.projectId?.projectName || "-"}</td>
                <td>{t.priority}</td>
                <td>{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "-"}</td>

                <td>
                  {formatMinutes(
                    (t.timeSpent || 0) + (t.running ? t.liveSeconds : 0)
                  )}
                </td>

                <td>{t.status}</td>

                <td>
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      Update Status
                    </button>
                    <ul className="dropdown-menu">
                      {["Pending", "In Progress", "Completed"].map((s) => (
                        <li key={s}>
                          <button
                            className="dropdown-item"
                            disabled={t.status === "Completed" && s === "Completed"}
                            onClick={() => {
                              if (s === "Completed") {
                                submitCompletedDirectly(t);
                              } else {
                                openStatusModal(t, s);
                              }
                            }}
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>

                <td>
                  <div className="d-flex gap-2">
                    {!t.running ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled={tasks.some(x => x.running)}
                        onClick={() => startTimer(t)}
                      >
                        ▶ Start
                      </button>
                    ) : (
                      <button
                        className="btn btn-outline-danger btn-sm"
                        onClick={() => stopTimer(t)}
                      >
                        ■ Stop
                      </button>
                    )}

                    <button
                      className="btn btn-info btn-sm"
                      onClick={() => openTask(t._id)}
                    >
                      View
                    </button>
                  </div>
                </td>

                <td>
                  <div>
                    <div className="fw-semibold">
                      {getStatusInfo(t)}
                    </div>

                    <small className="text-muted">
                      {t.updatedAt
                        ? new Date(t.updatedAt).toLocaleString()
                        : ""}
                    </small>
                  </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* -------- STATUS MODAL -------- */}
      {showModal && (
        <div className="modal show d-block" style={{ background: "#0006" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Update Status → {statusForm.status}</h5>
                <button className="btn-close" onClick={() => setShowModal(false)} />
              </div>

              <div className="modal-body">
                <textarea
                  className="form-control mb-2"
                  placeholder="Reason"
                  value={statusForm.reason}
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, reason: e.target.value })
                  }
                />

                {statusForm.status === "In Progress" && (
                  <input
                    type="number"
                    className="form-control mb-2"
                    placeholder="% Completed"
                    min="1"
                    max="100"
                    value={statusForm.progress}
                    onChange={(e) =>
                      setStatusForm({ ...statusForm, progress: e.target.value })
                    }
                  />
                )}

                <input
                  type="file"
                  className="form-control"
                  accept=".jpg,.png,.pdf"
                  onChange={(e) =>
                    setStatusForm({ ...statusForm, file: e.target.files[0] })
                  }
                />
              </div>

              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button className="btn btn-primary" onClick={submitStatus}>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
