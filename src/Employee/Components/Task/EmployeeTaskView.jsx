

// // import React, { useEffect, useState, useRef } from "react";
// // import axios from "axios";
// // import { API_URL } from "../../../config";
// // import { useParams, useNavigate } from "react-router-dom";

// // const fmt = (seconds) => {
// //   const mins = Math.floor(seconds / 60);
// //   const hrs = Math.floor(mins / 60);
// //   const rmins = mins % 60;
// //   return hrs > 0 ? `${hrs}h ${rmins}m` : `${rmins}m`;
// // };

// // export default function EmployeeTaskView() {
// //   const { taskId } = useParams();
// //   const navigate = useNavigate();

// //   const [task, setTask] = useState(null);
// //   const [loading, setLoading] = useState(true);
// //   const [commentText, setCommentText] = useState("");
// //   const [file, setFile] = useState(null);
// //   const intervalRef = useRef(null);

// //   const user = JSON.parse(localStorage.getItem("user")) || {};
// //   const employeeId = user.employeeId || user._id;

// //   const loadTask = async () => {
// //     try {
// //       const res = await axios.get(`${API_URL}/api/tasks/view/${taskId}`);
// //       setTask(res.data.task);
// //       setLoading(false);
// //     } catch (err) {
// //       console.error("TASK LOAD ERROR:", err);
// //       setTask(null);
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     loadTask();
// //     return () => intervalRef.current && clearInterval(intervalRef.current);
// //   }, [taskId]);

// //   const startTimer = async () => {
// //     try {
// //       await axios.post(`${API_URL}/api/tasks/timerStart/${task._id}`);

// //       intervalRef.current = setInterval(() => {
// //         setTask((prev) =>
// //           prev ? { ...prev, timeSpent: (prev.timeSpent || 0) + 1 } : prev
// //         );
// //       }, 1000);

// //       loadTask();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Cannot start timer");
// //     }
// //   };

// //   const stopTimer = async () => {
// //     try {
// //       await axios.post(`${API_URL}/api/tasks/stopTimer/${task._id}`);

// //       if (intervalRef.current) clearInterval(intervalRef.current);

// //       loadTask();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Cannot stop timer");
// //     }
// //   };

// //   const addComment = async () => {
// //     if (!commentText && !file) {
// //       alert("Write a comment or upload file");
// //       return;
// //     }

// //     const form = new FormData();
// //     form.append("userId", employeeId);
// //     form.append("text", commentText);
// //     form.append("visibleToClient", false);
// //     if (file) form.append("attachment", file);

// //     try {
// //       await axios.post(`${API_URL}/api/comment/${taskId}`, form, {
// //         headers: { "Content-Type": "multipart/form-data" },
// //       });

// //       setCommentText("");
// //       setFile(null);
// //       loadTask();
// //     } catch (err) {
// //       console.error(err);
// //       alert("Failed to add comment");
// //     }
// //   };

// //   if (loading) return <h3 className="text-center mt-5">Loading task...</h3>;
// //   if (!task) return <h3 className="text-center mt-5">Task Not Found</h3>;

// //   return (
// //     <div className="container mt-4">

// //       {/* SCROLL FIX CSS */}
// //       <style>{`
// //         .scroll-area {
// //           max-height: calc(100vh - 130px);
// //           overflow-y: auto;
// //           padding-right: 10px;
// //         }

// //         /* hide scrollbar on chrome */
// //         .scroll-area::-webkit-scrollbar {
// //           width: 6px;
// //         }
// //         .scroll-area::-webkit-scrollbar-thumb {
// //           background: #c5c5c5;
// //           border-radius: 4px;
// //         }
// //       `}</style>

// //       <div className="d-flex justify-content-between align-items-center mb-3">
// //         <h3>{task?.title} — {task?.TaskId}</h3>

// //         <button className="btn btn-secondary" onClick={() => navigate(-1)}>
// //           Back
// //         </button>
// //       </div>

// //       <div className="row">

// //         {/* LEFT SIDE WITH SCROLL */}
// //         <div className="col-md-8 scroll-area">

// //           <div className="card mb-3">
// //             <div className="card-header bg-dark text-white">Details</div>
// //             <div className="card-body">
// //               <p><strong>Project:</strong> {task?.projectId?.projectName}</p>
// //               <p><strong>Client:</strong> {task?.clientId?.leadName}</p>
// //               <p><strong>Service:</strong> {task?.serviceId?.serviceName}</p>
// //               <p><strong>Category:</strong> {task?.category}</p>
// //               <p><strong>Description:</strong> {task?.description}</p>
// //             </div>
// //           </div>

// //           <div className="card mb-3">
// //             <div className="card-header">Time Tracking</div>
// //             <div className="card-body">
// //               <p><strong>Total Time Spent:</strong> {fmt(task.timeSpent || 0)}</p>

// //               {!task.lastLogRunning ? (
// //                 <button className="btn btn-primary me-2" onClick={startTimer}>
// //                   ▶ Start Timer
// //                 </button>
// //               ) : (
// //                 <button className="btn btn-danger me-2" onClick={stopTimer}>
// //                   ■ Stop Timer
// //                 </button>
// //               )}
// //             </div>
// //           </div>

// //           <div className="card mb-3">
// //             <div className="card-header">Time Logs</div>
// //             <div className="card-body">
// //               {!task.timeLogs?.length && <p>No logs yet.</p>}

// //               {task.timeLogs?.map((log, i) => (
// //                 <div key={i} className="border rounded p-2 mb-2">
// //                   <strong>{new Date(log.startAt).toLocaleString()}</strong> →{" "}
// //                   {log.endAt ? new Date(log.endAt).toLocaleString() : "Running"}
// //                   <br />
// //                   Duration: {fmt(log.duration)}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>

// //           <div className="card mb-3">
// //             <div className="card-header">Comments</div>
// //             <div className="card-body">
// //               <textarea
// //                 className="form-control"
// //                 rows="3"
// //                 value={commentText}
// //                 onChange={(e) => setCommentText(e.target.value)}
// //                 placeholder="Write your comment..."
// //               />

// //               <input
// //                 type="file"
// //                 className="form-control mt-2"
// //                 onChange={(e) => setFile(e.target.files[0])}
// //               />

// //               <button className="btn btn-primary mt-2" onClick={addComment}>
// //                 Add Comment
// //               </button>

// //               <hr />

// //               {task.comments?.map((c, i) => (
// //                 <div key={i} className="border rounded p-2 mb-2">
// //                   <strong>{c?.user?.ename || "User"}</strong>
// //                   <small className="text-muted"> ({new Date(c.createdAt).toLocaleString()})</small>
// //                   <p>{c.text}</p>

// //                   {c.attachment && (
// //                     <a
// //                       href={`${API_URL}/${c.attachment}`}
// //                       target="_blank"
// //                       rel="noreferrer"
// //                     >
// //                       📎 Attachment
// //                     </a>
// //                   )}
// //                 </div>
// //               ))}
// //             </div>
// //           </div>
// //         </div>

// //         {/* RIGHT SIDE META */}
// //         <div className="col-md-4">
// //           <div className="card">
// //             <div className="card-header bg-primary text-white">Meta</div>
// //             <div className="card-body">
// //               <p><strong>Status:</strong> {task.status}</p>
// //               <p><strong>Priority:</strong> {task.priority}</p>
// //               <p><strong>Start Date:</strong> {task.startDate?.split("T")[0]}</p>
// //               <p><strong>Due Date:</strong> {task.dueDate?.split("T")[0]}</p>

// //               <p className="mt-3">Created: {new Date(task?.createdAt).toLocaleString()}</p>
// //               <p>Updated: {new Date(task?.updatedAt).toLocaleString()}</p>
// //             </div>
// //           </div>
// //         </div>

// //       </div>
// //     </div>
// //   );
// // }

// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { API_URL } from "../../../config";
// import { useNavigate } from "react-router-dom";

// const formatMinutes = (seconds) => {
//   const mins = Math.floor(seconds / 60);
//   const hrs = Math.floor(mins / 60);
//   const rmins = mins % 60;
//   return hrs > 0 ? `${hrs}h ${rmins}m` : `${rmins}m`;
// };

// export default function EmployeeTask() {
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const intervalsRef = useRef({});

//   const userLocal = JSON.parse(localStorage.getItem("user")) || {};
//   const employeeId = userLocal.employeeId || userLocal._id;

//   const fetchTasks = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(`${API_URL}/api/tasks/employee/${employeeId}`);

//       let data = res.data.tasks || [];

//       // Normalize every task ID
//       const normalized = data.map((t) => {
//         const taskId = t._id || t.id;
//         const last = t.timeLogs?.length ? t.timeLogs[t.timeLogs.length - 1] : null;

//         return {
//           ...t,
//           _id: taskId,
//           running: last && last.startAt && !last.endAt,
//         };
//       });

//       setTasks(normalized);
//     } catch (err) {
//       console.error("Fetch tasks error:", err);
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchTasks();

//     return () => {
//       Object.values(intervalsRef.current).forEach((i) => clearInterval(i));
//     };
//   }, [employeeId]);

//   // ------------------ START TIMER --------------------
//   const startTimer = async (task) => {
//     try {
//       await axios.post(`${API_URL}/api/tasks/timerStart/${task._id}`);

//       // local running update
//       setTasks((prev) =>
//         prev.map((t) => (t._id === task._id ? { ...t, running: true } : t))
//       );

//       // clear existing interval
//       if (intervalsRef.current[task._id]) {
//         clearInterval(intervalsRef.current[task._id]);
//       }

//       // local ticking
//       intervalsRef.current[task._id] = setInterval(() => {
//         setTasks((prev) =>
//           prev.map((t) =>
//             t._id === task._id
//               ? { ...t, timeSpent: (t.timeSpent || 0) + 1 }
//               : t
//           )
//         );
//       }, 1000);
//     } catch (err) {
//       console.error("Timer Start Error:", err);
//       alert("Error starting timer");
//     }
//   };

//   // ------------------ STOP TIMER --------------------
//   const stopTimer = async (task) => {
//     try {
//       await axios.post(`${API_URL}/api/tasks/stopTimer/${task._id}`);

//       if (intervalsRef.current[task._id]) {
//         clearInterval(intervalsRef.current[task._id]);
//         delete intervalsRef.current[task._id];
//       }

//       fetchTasks();
//     } catch (err) {
//       console.error("Timer Stop Error:", err);
//       alert("Error stopping timer");
//     }
//   };

//   // ---------------- UPDATE STATUS -------------------
//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       let reason = "";
//       if (newStatus !== "Completed") {
//         reason = window.prompt("Reason (optional):", "");
//       }

//       await axios.patch(`${API_URL}/api/tasks/TaskStatus/${taskId}`, {
//         status: newStatus,
//         reason,
//       });

//       fetchTasks();
//     } catch (err) {
//       console.error("Update status error:", err);
//       alert("Failed to update status");
//     }
//   };

//   const openTask = (taskId) => {
//     navigate(`/employee/TaskView/${taskId}`);
//   };

//   if (loading) return <div className="text-center p-4">Loading…</div>;

//   if (!tasks.length)
//     return <div className="text-center p-4 text-muted">No tasks assigned</div>;

//   return (
//     <div className="container mt-3">
//       <h3 className="mb-3">My Tasks</h3>

//       <div className="row g-3">
//         {tasks.map((t) => (
//           <div className="col-md-6" key={t._id}>
//             <div className="card shadow-sm h-100">
//               <div className="card-body d-flex flex-column">

//                 <div className="d-flex justify-content-between">
//                   <div>
//                     <h5>{t.title}</h5>
//                     <p className="small text-muted">
//                       {t.projectId?.projectName || "-"}
//                     </p>
//                   </div>

//                   <div className="text-end">
//                     <span
//                       className={`badge ${
//                         t.priority === "High"
//                           ? "bg-danger"
//                           : t.priority === "Medium"
//                           ? "bg-warning text-dark"
//                           : "bg-secondary"
//                       }`}
//                     >
//                       {t.priority || "Low"}
//                     </span>

//                     <div className="small">
//                       Due:{" "}
//                       {t.dueDate
//                         ? new Date(t.dueDate).toLocaleDateString()
//                         : "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-3">
//                   <strong>Time spent:</strong> {formatMinutes(t.timeSpent || 0)}
//                   <br />
//                   <strong>Status:</strong> {t.status}
//                 </div>

//                 <div className="mt-auto d-flex gap-2">

//                   {!t.running ? (
//                     <button
//                       className="btn btn-primary btn-sm"
//                       onClick={() => startTimer(t)}
//                     >
//                       ▶ Start
//                     </button>
//                   ) : (
//                     <button
//                       className="btn btn-danger btn-sm"
//                       onClick={() => stopTimer(t)}
//                     >
//                       ■ Stop
//                     </button>
//                   )}

//                   <div className="dropdown">
//                     <button
//                       className="btn btn-outline-secondary btn-sm dropdown-toggle"
//                       data-bs-toggle="dropdown"
//                     >
//                       Update Status
//                     </button>
//                     <ul className="dropdown-menu">
//                       <li>
//                         <button
//                           className="dropdown-item"
//                           onClick={() => handleStatusChange(t._id, "Pending")}
//                         >
//                           Pending
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           className="dropdown-item"
//                           onClick={() => handleStatusChange(t._id, "In Progress")}
//                         >
//                           In Progress
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           className="dropdown-item"
//                           onClick={() => handleStatusChange(t._id, "Completed")}
//                         >
//                           Completed
//                         </button>
//                       </li>
//                     </ul>
//                   </div>

//                   <button className="btn btn-info btn-sm" onClick={() => openTask(t._id)}>
//                     View
//                   </button>

//                   <button className="btn btn-outline-secondary btn-sm" onClick={fetchTasks}>
//                     ⟳
//                   </button>

//                 </div>
//               </div>

//               <div className="card-footer small text-muted">
//                 Updated:{" "}
//                 {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "-"}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { useParams, useNavigate } from "react-router-dom";

const fmt = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const rmins = mins % 60;
  return hrs > 0 ? `${hrs}h ${rmins}m` : `${rmins}m`;
};

export default function EmployeeTaskView() {
  const { taskId } = useParams();
  const navigate = useNavigate();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState("");
  const [file, setFile] = useState(null);
  const intervalRef = useRef(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const employeeId = user.employeeId || user._id;

  // Load task details
  const loadTask = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/tasks/view/${taskId}`);
      const t = res.data.task;

      // Handle missing id / _id
      t._id = t._id || t.id;

      // Detect running
      const last =
        t.timeLogs && t.timeLogs.length
          ? t.timeLogs[t.timeLogs.length - 1]
          : null;

      t.lastLogRunning = last && last.startAt && !last.endAt;

      setTask(t);
    } catch (err) {
      console.error("TASK LOAD ERROR:", err);
      setTask(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadTask();
    return () => intervalRef.current && clearInterval(intervalRef.current);
  }, [taskId]);

  // ---------------- START TIMER ----------------
  const startTimer = async () => {
    try {
      await axios.post(`${API_URL}/api/tasks/timerStart/${task._id}`);

      // Start local ticking
      intervalRef.current = setInterval(() => {
        setTask((prev) =>
          prev ? { ...prev, timeSpent: (prev.timeSpent || 0) + 1 } : prev
        );
      }, 1000);

      loadTask();
    } catch (err) {
      console.error("START ERROR", err);
      alert("Cannot start timer");
    }
  };

  // ---------------- STOP TIMER ----------------
  const stopTimer = async () => {
    try {
      await axios.post(`${API_URL}/api/tasks/stopTimer/${task._id}`);

      if (intervalRef.current) clearInterval(intervalRef.current);

      loadTask();
    } catch (err) {
      console.error("STOP ERROR", err);
      alert("Cannot stop timer");
    }
  };

  // ---------------- ADD COMMENT ----------------
  const addComment = async () => {
    if (!commentText && !file) {
      alert("Write a comment or upload file");
      return;
    }

    const form = new FormData();
    form.append("userId", employeeId);
    form.append("text", commentText);
    form.append("visibleToClient", false);

    if (file) form.append("attachment", file);

    try {
      await axios.post(`${API_URL}/api/tasks/comment/${taskId}`, form, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setCommentText("");
      setFile(null);

      loadTask();
    } catch (err) {
      console.error("COMMENT ERROR:", err);
      alert("Comment upload failed");
    }
  };

  // ---------------- VIEW UI ----------------
  if (loading) return <h3 className="text-center mt-5">Loading task…</h3>;
  if (!task) return <h3 className="text-center mt-5">Task Not Found</h3>;

  return (
    <div className="container mt-4">

      {/* Smooth Scroll */}
      <style>{`
        .scroll-area {
          max-height: calc(100vh - 130px);
          overflow-y: auto;
          padding-right: 10px;
        }
        .scroll-area::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-area::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 4px;
        }
      `}</style>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>
          {task.title} — <span className="text-muted">{task.TaskId}</span>
        </h3>

        <button className="btn btn-secondary" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <div className="row">

        {/* LEFT SIDE */}
        <div className="col-md-8 scroll-area">

          {/* Details */}
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

          {/* Time Tracking */}
          <div className="card mb-3">
            <div className="card-header">Time Tracking</div>
            <div className="card-body">
              <p><strong>Total Time:</strong> {fmt(task.timeSpent || 0)}</p>

              {!task.lastLogRunning ? (
                <button className="btn btn-primary me-2" onClick={startTimer}>
                  ▶ Start Timer
                </button>
              ) : (
                <button className="btn btn-danger me-2" onClick={stopTimer}>
                  ■ Stop Timer
                </button>
              )}
            </div>
          </div>

          {/* Time Logs */}
          <div className="card mb-3">
            <div className="card-header">Time Logs</div>
            <div className="card-body">
              {!task.timeLogs?.length && <p>No logs recorded yet.</p>}

              {task.timeLogs?.map((log, i) => (
                <div key={i} className="border rounded p-2 mb-2">
                  <strong>{new Date(log.startAt).toLocaleString()}</strong>
                  {" → "}
                  {log.endAt
                    ? new Date(log.endAt).toLocaleString()
                    : "Running..."}
                  <br />
                  Duration: {fmt(log.duration || 0)}
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="card mb-3">
            <div className="card-header">Comments</div>

            <div className="card-body">

              <textarea
                className="form-control"
                rows="3"
                placeholder="Write your comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />

              <input
                type="file"
                className="form-control mt-2"
                onChange={(e) => setFile(e.target.files[0])}
              />

              <button className="btn btn-primary mt-2" onClick={addComment}>
                Add Comment
              </button>

              <hr />

              {task.comments?.map((c, i) => (
                <div key={i} className="border rounded p-2 mb-2">
                  <strong>{c?.user?.ename || "User"}</strong>
                  <small className="text-muted">
                    {" "}
                    ({new Date(c.createdAt).toLocaleString()})
                  </small>
                  <p>{c.text}</p>

                  {c.attachment && (
                    <a
                      href={`${API_URL}/${c.attachment}`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      📎 View Attachment
                    </a>
                  )}
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT SIDE */}
        <div className="col-md-4">
          <div className="card">
            <div className="card-header bg-primary text-white">Meta</div>
            <div className="card-body">

              <p><strong>Status:</strong> {task.status}</p>
              <p><strong>Priority:</strong> {task.priority}</p>

              <p><strong>Start Date:</strong> {task.startDate?.split("T")[0]}</p>
              <p><strong>Due Date:</strong> {task.dueDate?.split("T")[0]}</p>

              <hr />

              <p><strong>Created:</strong> {new Date(task.createdAt).toLocaleString()}</p>
              <p><strong>Updated:</strong> {new Date(task.updatedAt).toLocaleString()}</p>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
