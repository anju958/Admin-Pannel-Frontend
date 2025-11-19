
// import React, { useEffect, useState, useRef } from "react";
// import axios from "axios";
// import { API_URL } from "../../../config";
// import { useNavigate } from "react-router-dom";

// const formatMinutes = (seconds) => {
//   const mins = Math.floor(seconds / 60);
//   const hrs = Math.floor(mins / 60);
//   const rmins = mins % 60;
//   if (hrs > 0) return `${hrs}h ${rmins}m`;
//   return `${rmins}m`;
// };

// export default function EmployeeTask() {
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const intervalsRef = useRef({});

//   const employeeLocal = JSON.parse(localStorage.getItem("user")) || {};
//   const employeeId =
//     employeeLocal.employeeId || localStorage.getItem("employeeId");

//   // Load tasks of employee
//   const fetchTasks = async () => {
//     setLoading(true);

//     if (!employeeId) {
//       console.warn("employeeId not found in localStorage");
//       setTasks([]);
//       setLoading(false);
//       return;
//     }

//     try {
//       const res = await axios.get(
//         `${API_URL}/api/tasks/employee/${employeeId}`
//       );

//       const data = res.data.tasks || [];

//       const normalized = data.map((t) => {
//         const last =
//           t.timeLogs && t.timeLogs.length
//             ? t.timeLogs[t.timeLogs.length - 1]
//             : null;

//         return {
//           ...t,
//           running: last && last.startAt && !last.endAt,
//         };
//       });

//       setTasks(normalized);
//     } catch (err) {
//       console.error("Fetch tasks error", err);
//     } finally {
//       setLoading(false);
//     }
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

//       setTasks((prev) =>
//         prev.map((t) =>
//           t._id === task._id ? { ...t, running: true } : t
//         )
//       );

//       if (intervalsRef.current[task._id]) {
//         clearInterval(intervalsRef.current[task._id]);
//       }

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
//       console.error("Start timer error", err);
//       alert("Could not start timer");
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

//       await fetchTasks();
//     } catch (err) {
//       console.error("Stop timer error", err);
//       alert("Could not stop timer");
//     }
//   };

//   // ---------------- UPDATE STATUS -------------------
//   const handleStatusChange = async (taskId, newStatus) => {
//     try {
//       let reason = "";
//       if (newStatus !== "Completed") {
//         reason = window.prompt(
//           "Reason for marking Pending / In Progress (optional):",
//           ""
//         );
//       }

//       await axios.patch(`${API_URL}/api/tasks/TaskStatus/${taskId}`, {
//         status: newStatus,
//         reason,
//       });

//       fetchTasks();
//     } catch (err) {
//       console.error("Status update error", err);
//       alert("Failed to update status");
//     }
//   };

//   const openTask = (taskId) => {
//     navigate(`/employee/TaskView/${taskId}`);
//   };

//   if (loading)
//     return <div className="p-4 text-center">Loading tasks...</div>;

//   if (!tasks.length)
//     return (
//       <div className="p-4 text-center text-muted">
//         No tasks assigned to you.
//       </div>
//     );

//   return (
//     <div className="container mt-3">
//       <h3 className="mb-3">My Tasks</h3>

//       <div className="row g-3">
//         {tasks.map((t) => (
//           <div className="col-md-6" key={t._id}>
//             <div className="card h-100 shadow-sm">
//               <div className="card-body d-flex flex-column">
//                 <div className="d-flex justify-content-between">
//                   <div>
//                     <h5 className="card-title mb-1">{t.title}</h5>
//                     <p className="text-muted small">
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
//                     <div className="small mt-1">
//                       Due:{" "}
//                       {t.dueDate
//                         ? new Date(t.dueDate).toLocaleDateString()
//                         : "-"}
//                     </div>
//                   </div>
//                 </div>

//                 <div className="mt-3">
//                   <strong>Time spent:</strong>{" "}
//                   {formatMinutes(t.timeSpent || 0)}
//                   <br />
//                   <strong>Status:</strong> {t.status}
//                 </div>

//                 <div className="mt-auto d-flex gap-2">
//                   {!t.running ? (
//                     <button
//                       className="btn btn-outline-primary btn-sm"
//                       onClick={() => startTimer(t)}
//                     >
//                       ▶ Start
//                     </button>
//                   ) : (
//                     <button
//                       className="btn btn-outline-danger btn-sm"
//                       onClick={() => stopTimer(t)}
//                     >
//                       ■ Stop
//                     </button>
//                   )}

//                   {/* STATUS DROPDOWN */}
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
//                           onClick={() =>
//                             handleStatusChange(t._id, "Pending")
//                           }
//                         >
//                           Pending
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           className="dropdown-item"
//                           onClick={() =>
//                             handleStatusChange(t._id, "In Progress")
//                           }
//                         >
//                           In Progress
//                         </button>
//                       </li>
//                       <li>
//                         <button
//                           className="dropdown-item"
//                           onClick={() =>
//                             handleStatusChange(t._id, "Completed")
//                           }
//                         >
//                           Completed
//                         </button>
//                       </li>
//                     </ul>
//                   </div>

//                   <button
//                     className="btn btn-info btn-sm"
//                     onClick={() => openTask(t._id)}
//                   >
//                     View
//                   </button>

//                   <button
//                     className="btn btn-outline-secondary btn-sm"
//                     onClick={() => fetchTasks()}
//                   >
//                     ⟳
//                   </button>
//                 </div>
//               </div>

//               <div className="card-footer small text-muted">
//                 Updated:{" "}
//                 {t.updatedAt
//                   ? new Date(t.updatedAt).toLocaleString()
//                   : "-"}
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
import { useNavigate } from "react-router-dom";

const formatMinutes = (seconds) => {
  const mins = Math.floor(seconds / 60);
  const hrs = Math.floor(mins / 60);
  const rmins = mins % 60;
  return hrs > 0 ? `${hrs}h ${rmins}m` : `${rmins}m`;
};

export default function EmployeeTask() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const intervalsRef = useRef({});

  const employeeLocal = JSON.parse(localStorage.getItem("user")) || {};
  const employeeId =
    employeeLocal.employeeId || localStorage.getItem("employeeId");

  // ------------------ LOAD TASKS ------------------
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
    fetchTasks();

    return () => {
      Object.values(intervalsRef.current).forEach((i) => clearInterval(i));
    };
  }, [employeeId]);

  // ------------------ START TIMER ------------------
  const startTimer = async (task) => {
    try {
      await axios.post(`${API_URL}/api/tasks/timerStart/${task._id}`);

      setTasks((prev) =>
        prev.map((t) =>
          t._id === task._id ? { ...t, running: true } : t
        )
      );

      if (intervalsRef.current[task._id]) {
        clearInterval(intervalsRef.current[task._id]);
      }

      intervalsRef.current[task._id] = setInterval(() => {
        setTasks((prev) =>
          prev.map((t) =>
            t._id === task._id
              ? { ...t, timeSpent: (t.timeSpent || 0) + 1 }
              : t
          )
        );
      }, 1000);
    } catch (err) {
      console.error("Start timer error", err);
      alert("Cannot start timer");
    }
  };

  // ------------------ STOP TIMER ------------------
  const stopTimer = async (task) => {
    try {
      await axios.post(`${API_URL}/api/tasks/stopTimer/${task._id}`);

      if (intervalsRef.current[task._id]) {
        clearInterval(intervalsRef.current[task._id]);
        delete intervalsRef.current[task._id];
      }

      fetchTasks();
    } catch (err) {
      console.error("Stop timer error", err);
      alert("Cannot stop timer");
    }
  };

  // ------------------ UPDATE STATUS ------------------
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      let reason = "";
      if (newStatus !== "Completed") {
        reason = window.prompt(
          "Reason for Pending / In Progress?",
          ""
        );
      }

      await axios.patch(
        `${API_URL}/api/tasks/TaskStatus/${taskId}`,
        {
          status: newStatus,
          reason,
        }
      );

      fetchTasks();
    } catch (err) {
      console.error("Status update failed:", err);
      alert("Status update failed");
    }
  };

  const openTask = (id) => navigate(`/employee/TaskView/${id}`);

  if (loading)
    return <div className="p-4 text-center">Loading tasks...</div>;

  if (!tasks.length)
    return (
      <div className="p-4 text-center text-muted">
        No tasks assigned to you.
      </div>
    );

  return (
    <div className="container mt-3">
      {/* FIX DROPDOWN CUTTING ISSUE */}
      <style>{`
        .card { overflow: visible !important; }
        .dropdown-menu {
          z-index: 9999 !important;
          position: absolute !important;
        }
      `}</style>

      <h3 className="mb-3">My Tasks</h3>

      <div className="row g-3">
        {tasks.map((t) => (
          <div className="col-md-6" key={t._id}>
            <div className="card h-100 shadow-sm">
              <div className="card-body d-flex flex-column">

                <div className="d-flex justify-content-between">
                  <div>
                    <h5 className="card-title mb-1">{t.title}</h5>
                    <p className="text-muted small">
                      {t.projectId?.projectName || "-"}
                    </p>
                  </div>

                  <div className="text-end">
                    <span
                      className={`badge ${
                        t.priority === "High"
                          ? "bg-danger"
                          : t.priority === "Medium"
                          ? "bg-warning text-dark"
                          : "bg-secondary"
                      }`}
                    >
                      {t.priority}
                    </span>
                    <div className="small mt-1">
                      Due:{" "}
                      {t.dueDate
                        ? new Date(t.dueDate).toLocaleDateString()
                        : "-"}
                    </div>
                  </div>
                </div>

                <div className="mt-3">
                  <strong>Time spent:</strong>{" "}
                  {formatMinutes(t.timeSpent || 0)}
                  <br />
                  <strong>Status:</strong> {t.status}
                </div>

                <div className="mt-auto d-flex gap-2">

                  {!t.running ? (
                    <button
                      className="btn btn-outline-primary btn-sm"
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

                  {/* STATUS DROPDOWN */}
                  <div className="dropdown">
                    <button
                      className="btn btn-outline-secondary btn-sm dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      Update Status
                    </button>
                    <ul className="dropdown-menu">
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleStatusChange(t._id, "Pending")
                          }
                        >
                          Pending
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleStatusChange(t._id, "In Progress")
                          }
                        >
                          In Progress
                        </button>
                      </li>
                      <li>
                        <button
                          className="dropdown-item"
                          onClick={() =>
                            handleStatusChange(t._id, "Completed")
                          }
                        >
                          Completed
                        </button>
                      </li>
                    </ul>
                  </div>

                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => openTask(t._id)}
                  >
                    View
                  </button>

                  <button
                    className="btn btn-outline-secondary btn-sm"
                    onClick={() => fetchTasks()}
                  >
                    ⟳
                  </button>
                </div>
              </div>

              <div className="card-footer small text-muted">
                Updated:{" "}
                {t.updatedAt
                  ? new Date(t.updatedAt).toLocaleString()
                  : "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
