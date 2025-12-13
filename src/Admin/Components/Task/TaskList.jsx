// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx"; // ✅ Excel Export
// import { API_URL } from "../../../config";
// import { useNavigate } from "react-router-dom";

// const TaskList = () => {
//   const navigate = useNavigate();
//   const [tasks, setTasks] = useState([]);
//   const [search, setSearch] = useState(""); // ✅ SEARCH

//   // =======================
//   // Fetch All Tasks
//   // =======================
//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/tasks/all`);
//       setTasks(res.data.tasks || []);
//     } catch (error) {
//       console.error("Fetch Tasks Error:", error);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//   }, []);

//   const handleView = (id) => navigate(`/admin/task/${id}`);

//   const handleAssign = () => navigate("/admin/task/assign");

//   const handleDelete = async (taskId) => {
//     if (!window.confirm("Are you sure you want to delete this task?")) return;
//     try {
//       const res = await axios.delete(`${API_URL}/api/deleteTask/${taskId}`);
//       if (res.data.success) {
//         alert("Task deleted!");
//         fetchTasks();
//       }
//     } catch (err) {
//       console.error("Delete error:", err);
//     }
//   };

//   const statusColor = (status) => {
//     if (status === "Completed") return "success";
//     if (status === "In Progress") return "info";
//     return "secondary";
//   };

//   const priorityColor = (priority) => {
//     if (priority === "High") return "danger";
//     if (priority === "Medium") return "warning";
//     return "secondary";
//   };

//   // =======================
//   // ✅ Excel Download
//   // =======================
//   const downloadExcel = () => {
//     const excelData = tasks.map((t) => ({
//       Task: t.title,
//       Client:
//         t.clientId?.clientName ||
//         t.clientId?.leadName ||
//         "-",
//       Project: t.projectId?.projectName || "-",
//       AssignedTo: t.assignedTo?.map((e) => e.ename).join(", "),
//       Status: t.status,
//       Priority: t.priority,
//       EstimatedTime: t.estimatedTime + " min",
//       TimeSpent: Math.floor((t.timeSpent || 0) / 60) + " min",
//       StartDate: new Date(t.startDate).toLocaleDateString(),
//       Deadline: new Date(t.dueDate).toLocaleDateString(),
//     }));

//     const ws = XLSX.utils.json_to_sheet(excelData);
//     const wb = XLSX.utils.book_new();

//     XLSX.utils.book_append_sheet(wb, ws, "Tasks");
//     XLSX.writeFile(wb, "Task_List.xlsx");
//   };

//   // return (
//   //   <div className="container mt-4">

//   //     {/* =======================
//   //          Top Header
//   //     ======================= */}
//   //     <div className="d-flex justify-content-between align-items-center mb-4">
//   //       <h2 className="fw-bold">All Tasks</h2>

//   //       <div className="d-flex gap-3">
//   //         {/* Excel Button */}
//   //         <button
//   //           className="btn btn-success btn-lg"
//   //           style={{ borderRadius: "10px" }}
//   //           onClick={downloadExcel}
//   //         >
//   //           ⬇️ Download Excel
//   //         </button>

//   //         {/* Assign Task Button */}
//   //         <button
//   //           className="btn btn-primary btn-lg"
//   //           onClick={handleAssign}
//   //           style={{ borderRadius: "10px" }}
//   //         >
//   //           ➕ Assign New Task
//   //         </button>
//   //       </div>
//   //     </div>

//   //     {/* =======================
//   //          Search Box
//   //     ======================= */}
//   //     <input
//   //       type="text"
//   //       className="form-control mb-3"
//   //       placeholder="Search task..."
//   //       value={search}
//   //       onChange={(e) => setSearch(e.target.value)}
//   //     />

//   //     {/* =======================
//   //          Table
//   //     ======================= */}
//   //     <div className="card shadow-lg border-0 p-3" style={{ borderRadius: "15px" }}>
//   //       <table className="table table-hover align-middle text-center">
//   //         <thead className="table-dark">
//   //           <tr>
//   //             <th>Task</th>
//   //             <th>Client</th>
//   //             <th>Project</th>
//   //             <th>Assigned To</th>
//   //             <th>Status</th>
//   //             <th>Priority</th>
//   //             <th>Est. Time</th>
//   //             <th>Time Spent</th>
//   //             <th>Start</th>
//   //             <th>Deadline</th>
//   //             <th>View</th>
//   //             <th>Delete</th>
//   //           </tr>
//   //         </thead>

//   //         <tbody>
//   //           {tasks
//   //             .filter((t) => {
//   //               const q = search.toLowerCase();
//   //               return (
//   //                 t.title?.toLowerCase().includes(q) ||
//   //                 t.clientId?.leadName?.toLowerCase().includes(q) ||
//   //                 t.clientId?.clientName?.toLowerCase().includes(q) ||
//   //                 t.projectId?.projectName?.toLowerCase().includes(q) ||
//   //                 t.status?.toLowerCase().includes(q) ||
//   //                 t.priority?.toLowerCase().includes(q) ||
//   //                 t.assignedTo?.some((a) =>
//   //                   a.ename.toLowerCase().includes(q)
//   //                 )
//   //               );
//   //             })
//   //             .map((task) => (
//   //               <tr key={task._id}>

//   //                 <td className="fw-bold">{task.title}</td>

//   //                 <td>
//   //                   {task.clientId?.clientName ||
//   //                     task.clientId?.leadName ||
//   //                     "-"}
//   //                 </td>

//   //                 <td>{task.projectId?.projectName || "-"}</td>

//   //                 <td>
//   //                   {task.assignedTo?.length
//   //                     ? task.assignedTo.map((e) => e.ename).join(", ")
//   //                     : "-"}
//   //                 </td>

//   //                 <td>
//   //                   <span className={`badge bg-${statusColor(task.status)} px-3 py-2`}>
//   //                     {task.status}
//   //                   </span>
//   //                 </td>

//   //                 <td>
//   //                   <span className={`badge bg-${priorityColor(task.priority)} px-3 py-2`}>
//   //                     {task.priority}
//   //                   </span>
//   //                 </td>

//   //                 <td>{task.estimatedTime || 0} min</td>

//   //                 <td>{Math.floor((task.timeSpent || 0) / 60)} min</td>

//   //                 <td>{new Date(task.startDate).toLocaleDateString()}</td>

//   //                 <td>
//   //                   <strong>{new Date(task.dueDate).toLocaleDateString()}</strong>
//   //                 </td>

//   //                 <td>
//   //                   <button
//   //                     className="btn btn-info btn-sm"
//   //                     onClick={() => handleView(task._id)}
//   //                   >
//   //                     View
//   //                   </button>
//   //                 </td>

//   //                 <td>
//   //                   <button
//   //                     className="btn btn-danger btn-sm"
//   //                     onClick={() => handleDelete(task._id)}
//   //                   >
//   //                     Delete
//   //                   </button>
//   //                 </td>

//   //               </tr>
//   //             ))}

//   //           {tasks.length === 0 && (
//   //             <tr>
//   //               <td colSpan="12" className="text-muted py-4 fs-5">
//   //                 No tasks found
//   //               </td>
//   //             </tr>
//   //           )}
//   //         </tbody>

//   //       </table>
//   //     </div>
//   //   </div>
//   // );
// return (
//   <div className="container-fluid mt-4">

//     {/* HEADER AREA */}
//     <div className="d-flex justify-content-between align-items-center mb-4">
//       <h2 className="fw-bold text-dark">📋 Task Management</h2>

//       <div className="d-flex gap-3">
//         <button className="btn btn-success px-4 shadow-sm rounded-pill" onClick={downloadExcel}>
//           ⬇ Export Excel
//         </button>

//         <button className="btn btn-primary px-4 shadow-sm rounded-pill" onClick={handleAssign}>
//           ➕ Add Task
//         </button>
//       </div>
//     </div>

//     {/* SEARCH BOX */}
//     <div className="card shadow-sm border-0 mb-4" style={{ borderRadius: "12px" }}>
//       <div className="card-body p-3">
//         <input
//           type="text"
//           className="form-control form-control-lg search-input"
//           placeholder="🔍 Search task, client, project, status..."
//           value={search}
//           onChange={(e) => setSearch(e.target.value)}
//         />
//       </div>
//     </div>

//     {/* TABLE CARD */}
//     <div className="card shadow-lg border-0" style={{ borderRadius: "15px" }}>
//       <div className="table-responsive">
//         <table className="table table-hover align-middle modern-table">
//           <thead>
//             <tr>
//               <th>Task</th>
//               <th>Client</th>
//               <th>Project</th>
//               <th>Assigned To</th>
//               <th>Status</th>
//               <th>Priority</th>
//               <th>Est. Time</th>
//               <th>Spent</th>
//               <th>Start</th>
//               <th>Deadline</th>
//               <th></th>
//             </tr>
//           </thead>

//           <tbody>
//             {tasks
//               .filter((t) => {
//                 const q = search.toLowerCase();
//                 return (
//                   t.title?.toLowerCase().includes(q) ||
//                   t.clientId?.clientName?.toLowerCase().includes(q) ||
//                   t.projectId?.projectName?.toLowerCase().includes(q) ||
//                   t.status?.toLowerCase().includes(q) ||
//                   t.priority?.toLowerCase().includes(q)
//                 );
//               })
//               .map((task) => (
//                 // <tr key={task._id}>

//                 //   <td className="fw-semibold text-dark">
//                 //     {task.title}
//                 //   </td>

//                 //   <td className="text-muted">
//                 //     {task.clientId?.clientName || "-"}
//                 //   </td>

//                 //   <td>{task.projectId?.projectName || "-"}</td>

//                 //   <td className="text-primary">
//                 //     {task.assignedTo?.map((e) => e.ename).join(", ") || "-"}
//                 //   </td>

//                 //   <td>
//                 //     <span className={`badge rounded-pill px-3 py-2 bg-${statusColor(task.status)}`}>
//                 //       {task.status}
//                 //     </span>
//                 //   </td>

//                 //   <td>
//                 //     <span className={`badge rounded-pill px-3 py-2 bg-${priorityColor(task.priority)}`}>
//                 //       {task.priority}
//                 //     </span>
//                 //   </td>

//                 //   <td className="text-secondary">{task.estimatedTime}m</td>

//                 //   <td className="text-secondary">
//                 //     {Math.floor((task.timeSpent || 0) / 60)}m
//                 //   </td>

//                 //   <td className="text-secondary">
//                 //     {new Date(task.startDate).toLocaleDateString()}
//                 //   </td>

//                 //   <td className="fw-bold text-dark">
//                 //     {new Date(task.dueDate).toLocaleDateString()}
//                 //   </td>

//                 //   <td className="d-flex gap-2 justify-content-center">
//                 //     <button className="btn btn-outline-primary btn-sm rounded-pill px-3"
//                 //       onClick={() => handleView(task._id)}>
//                 //       View
//                 //     </button>

//                 //     <button className="btn btn-outline-danger btn-sm rounded-pill px-3"
//                 //       onClick={() => handleDelete(task._id)}>
//                 //       Delete
//                 //     </button>
//                 //   </td>

//                 // </tr>
//                 <tr key={task._id}>
//   <td className="fw-semibold">{task.title}</td>

//   <td>{task.clientId?.clientName || "-"}</td>

//   <td>{task.projectId?.projectName || "-"}</td>

//   <td>{task.assignedTo?.map((e) => e.ename).join(", ") || "-"}</td>

//   <td>
//     <span className={`badge bg-${statusColor(task.status)}`}>
//       {task.status}
//     </span>
//   </td>

//   <td>
//     <span className={`badge bg-${priorityColor(task.priority)}`}>
//       {task.priority}
//     </span>
//   </td>

//   <td>{task.estimatedTime}m</td>

//   <td>{Math.floor((task.timeSpent || 0) / 60)}m</td>

//   <td>{new Date(task.startDate).toLocaleDateString()}</td>

//   <td className="fw-bold">{new Date(task.dueDate).toLocaleDateString()}</td>

//   <td>
//     <button className="btn btn-outline-primary btn-sm rounded-pill px-3"
//       onClick={() => handleView(task._id)}>
//       View
//     </button>
//   </td>

//   <td>
//     <button className="btn btn-outline-danger btn-sm rounded-pill px-3"
//       onClick={() => handleDelete(task._id)}>
//       Delete
//     </button>
//   </td>
// </tr>

//               ))}

//             {tasks.length === 0 && (
//               <tr>
//                 <td colSpan="11" className="text-center py-4 text-muted">
//                   No tasks available
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   </div>
// );




// };

// export default TaskList;

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
