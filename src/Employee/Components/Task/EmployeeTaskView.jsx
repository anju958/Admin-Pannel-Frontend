import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { useParams, useNavigate } from "react-router-dom";

/* ---------------- FORMAT TIME ---------------- */
const fmt = (seconds = 0) => {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const rmins = mins % 60;
  return hrs > 0 ? `${hrs}h ${rmins}m` : `${rmins}m`;
};

export default function EmployeeTaskView() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const [adminMessages, setAdminMessages] = useState([]);

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ---------------- LOAD TASK ---------------- */
  const loadTask = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks/view/${taskId}`);
      const t = res.data.task;

      const last =
        t.timeLogs?.length > 0
          ? t.timeLogs[t.timeLogs.length - 1]
          : null;

      t.running = last && !last.endAt;
      t.runningStartAt = t.running ? last.startAt : null;

      setTask(t);
    } catch (err) {
      console.error("TASK LOAD ERROR:", err);
      setTask(null);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- INITIAL LOAD ---------------- */
  useEffect(() => {
    loadTask();
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [taskId]);

  /* ---------------- LIVE TIMER ---------------- */
  useEffect(() => {
    if (!task?.running || !task.runningStartAt) return;

    intervalRef.current = setInterval(() => {
      setTask((prev) => {
        if (!prev?.running) return prev;

        const liveSeconds = Math.floor(
          (Date.now() - new Date(prev.runningStartAt)) / 1000
        );

        return { ...prev, liveSeconds };
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [task?.running]);

  /* ---------------- START TIMER ---------------- */
  const startTimer = async () => {
    try {
      await axios.post(`${API_URL}/api/tasks/timerStart/${task._id}`);
      loadTask();
    } catch (err) {
      alert(err?.response?.data?.message || "Cannot start timer");
    }
  };

  /* ---------------- STOP TIMER ---------------- */
  const stopTimer = async () => {
    try {
      await axios.post(`${API_URL}/api/tasks/stopTimer/${task._id}`);
      clearInterval(intervalRef.current);
      loadTask();
    } catch (err) {
      alert(err?.response?.data?.message || "Cannot stop timer");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const employeeId = user.employeeId || user._id;

    if (!employeeId || !taskId) return;

    axios
      .get(`${API_URL}/api/notifications/task/${taskId}/employee/${employeeId}`)
      .then((res) => {
        console.log("ADMIN MESSAGE RESPONSE:", res.data);
        setAdminMessages(res.data || []);
      })
      .catch(() => setAdminMessages([]));
  }, [taskId]);


  /* ---------------- UI STATES ---------------- */
  if (loading) return <h3 className="text-center mt-5">Loading task…</h3>;
  if (!task) return <h3 className="text-center mt-5">Task Not Found</h3>;

  const totalSeconds =
    (task.timeSpent || 0) + (task.running ? task.liveSeconds || 0 : 0);

  /* 🔑 Latest Status Update */
  const lastStatus =
    task.statusHistory?.length > 0
      ? task.statusHistory[task.statusHistory.length - 1]
      : null;

  return (
    <div className="container mt-4">

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{task.title}</h3>
        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-md-8">

          {/* DETAILS */}
          <div className="card mb-3">
            <div className="card-header bg-dark text-white">Details</div>
            <div className="card-body">
              <p><strong>Project:</strong> {task.projectId?.projectName || "-"}</p>
              <p><strong>Client:</strong> {task.clientId?.leadName || "-"}</p>
              <p><strong>Service:</strong> {task.serviceId?.serviceName || "-"}</p>
              <p><strong>Category:</strong> {task.category || "-"}</p>
              <p><strong>Description:</strong> {task.description || "-"}</p>
            </div>
          </div>
          {/* 🔔 ADMIN MESSAGE */}
          {adminMessages.length > 0 && (
            <div className="card mb-3 border-warning">
              <div className="card-header bg-warning text-dark">
                🔔 Messages from Admin
              </div>

              <div className="card-body">
                {adminMessages.map((msg, index) => (
                  <div key={index} className="border rounded p-2 mb-2">
                    <p className="mb-1">
                      <strong>{msg.title}</strong>
                    </p>
                    <p>{msg.message}</p>
                    <p className="text-muted small">
                      {new Date(msg.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {/* TIME TRACKING */}
          <div className="card mb-3">
            <div className="card-header">Time Tracking</div>
            <div className="card-body">
              <p><strong>Total Time:</strong> {fmt(totalSeconds)}</p>

              {!task.running ? (
                <button className="btn btn-primary" onClick={startTimer}>
                  ▶ Start Timer
                </button>
              ) : (
                <button className="btn btn-danger" onClick={stopTimer}>
                  ■ Stop Timer
                </button>
              )}
            </div>
          </div>

          {/* TIME LOGS */}
          <div className="card mb-3">
            <div className="card-header">Time Logs</div>
            <div className="card-body">
              {!task.timeLogs?.length && <p>No logs recorded yet.</p>}

              {task.timeLogs.map((log, i) => (
                <div key={i} className="border rounded p-2 mb-2">
                  <strong>{new Date(log.startAt).toLocaleString()}</strong>{" → "}
                  {log.endAt
                    ? new Date(log.endAt).toLocaleString()
                    : "Running..."}
                  <br />
                  Duration: {fmt(log.duration || 0)}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE (ORANGE AREA FIXED) */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">Meta</div>
            <div className="card-body">

              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Priority:</strong> {task.priority}</p>
              <p><strong>Start Date:</strong> {task.startDate?.split("T")[0]}</p>
              <p><strong>Due Date:</strong> {task.dueDate?.split("T")[0]}</p>

              <hr />

              {/* 🔶 STATUS REASON */}
              {lastStatus && (
                <>
                  <h6>Status Update</h6>

                  {lastStatus.reason && (
                    <p><strong>Reason:</strong> {lastStatus.reason}</p>
                  )}

                  {/* ✅ SHOW PROGRESS */}
                  {lastStatus.progress !== undefined && (
                    <p><strong>Progress:</strong> {lastStatus.progress}%</p>
                  )}

                  {/* ✅ SHOW ATTACHMENT */}
                  {lastStatus?.attachment && (
                    <p>
                      <strong>Attachment:</strong>{" "}
                      <a
                        href={`${API_URL}/api/tasks/task/status-file/${task._id}`}
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-outline-primary ms-2"
                      >
                        View File
                      </a>
                    </p>
                  )}

                  <p className="text-muted small">
                    Updated: {new Date(lastStatus.updatedAt).toLocaleString()}
                  </p>

                  <hr />
                </>
              )}

              <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(task.updatedAt).toLocaleString()}</p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
