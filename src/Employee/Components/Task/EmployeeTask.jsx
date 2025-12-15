

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
  const intervalsRef = useRef({});

  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FILTER STATE ---------------- */
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth() + 1);

  const employeeLocal = JSON.parse(localStorage.getItem("user")) || {};
  const employeeId =
    employeeLocal.employeeId || localStorage.getItem("employeeId");

  /* ---------------- FETCH TASKS ---------------- */
  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await axios.get(
        `${API_URL}/api/tasks/employee/${employeeId}`
      );

      const data = res.data.tasks || [];

      const normalized = data.map((t) => {
        const last =
          t.timeLogs?.length > 0
            ? t.timeLogs[t.timeLogs.length - 1]
            : null;

        return {
          ...t,
          running: last && last.startAt && !last.endAt,
        };
      });

      setTasks(normalized);
    } catch (err) {
      console.error("Task fetch failed:", err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    console.log(fetchTasks)
    fetchTasks();
    return () => {
      Object.values(intervalsRef.current).forEach(clearInterval);
    };
  }, [employeeId]);


  /* ---------------- FILTER (YEAR & MONTH) ---------------- */
  useEffect(() => {
    const filtered = tasks.filter((t) => {
      // ✅ USE startDate FIRST (your API field)
      const date = new Date(
        t.startDate || t.updatedAt || t.createdAt
      );

      if (isNaN(date)) return false;

      const taskYear = date.getFullYear();
      const taskMonth = date.getMonth() + 1;

      if (Number(year) !== taskYear) return false;
      if (month !== "all" && Number(month) !== taskMonth) return false;

      return true;
    });

    setFilteredTasks(filtered);
  }, [tasks, year, month]);


  /* ---------------- START TIMER ---------------- */
  const startTimer = async (task) => {
    try {
      await axios.post(`${API_URL}/api/tasks/timerStart/${task._id}`);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, running: true } : t
        )
      );

      intervalsRef.current[task._id] = setInterval(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === task._id
              ? { ...t, timeSpent: (t.timeSpent || 0) + 1 }
              : t
          )
        );
      }, 1000);
    } catch {
      alert("Cannot start timer");
    }
  };

  /* ---------------- STOP TIMER ---------------- */
  const stopTimer = async (task) => {
    try {
      await axios.post(`${API_URL}/api/tasks/stopTimer/${task._id}`);
      clearInterval(intervalsRef.current[task._id]);
      delete intervalsRef.current[task._id];
      fetchTasks();
    } catch {
      alert("Cannot stop timer");
    }
  };

  /* ---------------- UPDATE STATUS ---------------- */
  const handleStatusChange = async (taskId, status) => {
    try {
      let reason = "";
      if (status !== "Completed") {
        reason = window.prompt("Reason?", "");
      }

      await axios.patch(
        `${API_URL}/api/tasks/TaskStatus/${taskId}`,
        { status, reason }
      );

      fetchTasks();
    } catch {
      alert("Status update failed");
    }
  };

  const openTask = (id) => navigate(`/employee/TaskView/${id}`);

  if (loading)
    return <div className="p-4 text-center">Loading tasks...</div>;

  return (
    <div className="container mt-3">
      {/* -------- DROPDOWN FIX -------- */}
      <style>{`
        .status-dropdown.show ~ .view-btn,
        .status-dropdown.show ~ .refresh-btn {
          display: none !important;
        }
      `}</style>

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
                <option key={y} value={y}>
                  {y}
                </option>
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
                {new Date(0, i).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* -------- TABLE -------- */}
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
              <th  className="status-action-col">Status Action</th>
              <th className="actions-col">Actions</th>
              <th>Updated</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center text-muted">
                  No tasks found
                </td>
              </tr>
            )}

            {filteredTasks.map((t, index) => (
              <tr key={t._id}>
                <td>{index + 1}</td>

                {/* ✅ TASK NAME FIX */}
                <td>{t.taskName || t.title || "-"}</td>

                {/* ✅ PROJECT SAFE */}
                <td>{t.projectName || t.projectId?.projectName || "-"}</td>

                <td>
                  <span
                    className={`badge ${t.priority === "High"
                        ? "bg-danger"
                        : t.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                  >
                    {t.priority}
                  </span>
                </td>

                <td>
                  {t.dueDate
                    ? new Date(t.dueDate).toLocaleDateString()
                    : "-"}
                </td>

                <td>{formatMinutes(t.timeSpent)}</td>

                <td>
                  <span
                    className={`badge ${t.status === "Completed"
                        ? "bg-success"
                        : t.status === "In Progress"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                  >
                    {t.status}
                  </span>
                </td>
                <td className="status-action-col">
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
                            onClick={() => handleStatusChange(t._id, s)}
                          >
                            {s}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </td>


                <td className="actions-col">
                  <div className="d-flex gap-1 flex-wrap">
                    {!t.running ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        disabled={t.status === "Completed"}
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

                    <button
                      className="btn btn-outline-secondary btn-sm"
                      onClick={fetchTasks}
                    >
                      ⟳
                    </button>
                  </div>
                </td>


                <td>
                  {t.updatedAt
                    ? new Date(t.updatedAt).toLocaleString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
