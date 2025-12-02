
// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import * as XLSX from "xlsx";
// import { API_URL } from "../../../config";

// // Month names used for display
// const months = [
//   "January", "February", "March", "April", "May", "June",
//   "July", "August", "September", "October", "November", "December"
// ];

// function EmployeeAttendance() {
//   // Current logged-in user (from localStorage)
//   const user = JSON.parse(localStorage.getItem("user"));

//   // Local component state
//   const [attendanceData, setAttendanceData] = useState([]); // array of {date, status, check_in, check_out, workingHours}
//   const [summary, setSummary] = useState({}); // summary object from backend
//   const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
//   const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

//   const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [selectedAtt, setSelectedAtt] = useState(null);

//   // =========================
//   // Fetch monthly attendance
//   // =========================
//   const fetchAttendance = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/api/monthly`, {
//         params: {
//           employeeId: user._id,
//           month: selectedMonth,
//           year: selectedYear
//         }
//       });

//       // backend returns { data: [...], summary: {...} }
//       setAttendanceData(res.data.data || []);
//       setSummary(res.data.summary || {});
//     } catch (error) {
//       console.error("Attendance Fetch Error:", error);
//       setAttendanceData([]);
//       setSummary({});
//     }
//   };

//   useEffect(() => {
//     fetchAttendance();
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [selectedMonth, selectedYear]);


//   // =========================
//   // Icon helper
//   // =========================
//   // This function maps the normalized status string to the icon(s) we want to display.
//   // We intentionally accept multiple variants here (lowercasing) for resilience.
//   const getIcon = (status, isLateMinutes = 0) => {
//     if (!status) return "-";

//     const s = status.toString().trim().toLowerCase();
//     const lateIcon = isLateMinutes > 0 ? "⏰ " : ""; // Clock emoji for late

//     switch (s) {
//       case "present":
//         return <span style={{ fontSize: "20px", color: "green" }}>{lateIcon}✔</span>;

//       case "absent":
//         return <span style={{ fontSize: "20px", color: "red" }}>✖</span>;

//       case "holiday":
//         return <span style={{ fontSize: "20px", color: "gold" }}>⭐</span>;

//       case "paid leave":
//         return <span style={{ fontSize: "20px", color: "green" }}>🛫</span>;

//       case "unpaid leave":
//         return <span style={{ fontSize: "20px", color: "red" }}>🛫</span>;

//       case "half day":
//         return (
//           <span style={{ fontSize: "20px", color: "orange" }}>
//             {lateIcon}⚠
//           </span>
//         );

//       case "paid halfday":
//       case "paid half day":
//         return (
//           <span>
//             {lateIcon}
//             <span style={{ color: "green", fontSize: "18px", marginRight: 2 }}>🛫</span>
//             <span style={{ color: "orange", fontSize: "18px" }}>⚠</span>
//           </span>
//         );

//       case "unpaid halfday":
//       case "unpaid half day":
//         return (
//           <span>
//             {lateIcon}
//             <span style={{ color: "red", fontSize: "18px", marginRight: 2 }}>🛫</span>
//             <span style={{ color: "orange", fontSize: "18px" }}>⚠</span>
//           </span>
//         );

//       default:
//         return "-";
//     }
//   };


//   // =========================
//   // Export to Excel (updated)
//   // =========================
//   // The Excel export will include one row per employee, with columns:
//   // Date (1..N) = status string for that date, and separate sheet detail if desired.
//   const exportToExcel = () => {
//     // Build header row for the month
//     const header = ["Employee"];

//     for (let d = 1; d <= daysInMonth; d++) {
//       header.push(String(d));
//     }

//     // One row for employee: each cell = status string (we keep exact status from backend)
//     const row = [user.ename];
//     for (let d = 1; d <= daysInMonth; d++) {
//       // find attendance item by comparing day number
//       const att = attendanceData.find(a => {
//         // backend may return date as YYYY-MM-DD string; handle both cases
//         try {
//           const dateStr = a.date;
//           const day = new Date(dateStr).getDate();
//           return day === d;
//         } catch (e) {
//           return false;
//         }
//       });

//       // Put the status text in excel cell; fallback to blank
//       row.push(att ? (att.status || "") : "");
//     }

//     // Build a workbook with two sheets:
//     // 1) Summary row (wide table)
//     // 2) Detail sheet listing date / status / check_in / check_out / workingHours
//     const ws1 = XLSX.utils.aoa_to_sheet([header, row]);

//     // Build details (rows) for the detail sheet
//     const detailHeader = ["Date", "Status", "Check In", "Check Out", "Working Hours", "Paid?", "Is Halfday?"];
//     const detailRows = [detailHeader];

//     // Fill detail rows using attendanceData — ensure we produce one row for each day (even missing days)
//     for (let d = 1; d <= daysInMonth; d++) {
//       const dateKey = (() => {
//         const dd = String(d).padStart(2, "0");
//         const mm = String(selectedMonth).padStart(2, "0");
//         return `${selectedYear}-${mm}-${dd}`;
//       })();

//       const att = attendanceData.find(a => {
//         try {
//           // backend returns date string like '2025-11-23' or JS Date; normalize safely
//           const ds = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0];
//           return ds === dateKey;
//         } catch (e) { return false; }
//       });

//       // determine paid / half flags by checking status string
//       let paid = "";
//       let isHalf = "";
//       if (att && att.status) {
//         const s = att.status.toLowerCase();
//         if (s.includes("paid")) paid = "Yes";
//         else if (s.includes("unpaid")) paid = "No";

//         if (s.includes("half")) isHalf = "Yes";
//         else isHalf = "No";
//       }

//       const row = [dateKey, att ? att.status : "", att ? att.check_in || "" : "", att ? att.check_out || "" : "", att ? (att.workingHours ?? "") : "", paid, isHalf];
//       detailRows.push(row);
//     }

//     const ws2 = XLSX.utils.aoa_to_sheet(detailRows);

//     const wb = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(wb, ws1, "AttendanceSummary");
//     XLSX.utils.book_append_sheet(wb, ws2, "AttendanceDetail");

//     // Use a descriptive filename
//     XLSX.writeFile(wb, `${user.ename}_Attendance_${months[selectedMonth - 1]}_${selectedYear}.xlsx`);
//   };

//   // =========================
//   // Modal helper
//   // =========================
//   const openModal = (att) => {
//     setSelectedAtt(att);
//     setModalOpen(true);
//   };

//   const modalOverlay = modalOpen
//     ? {
//       backdropFilter: "blur(5px)",
//       WebkitBackdropFilter: "blur(5px)",
//       background: "rgba(0,0,0,0.15)",
//       position: "fixed",
//       top: 0,
//       left: 0,
//       width: "100%",
//       height: "100%",
//       zIndex: 999,
//     }
//     : {};

//   // =========================
//   // RENDER
//   // =========================
//   return (
//     <>
//       {modalOpen && <div style={modalOverlay} onClick={() => setModalOpen(false)} />}

//       <div className="container mt-4">

//         {/* Controls */}
//         <div className="d-flex gap-3 align-items-center mb-4">
//           <select className="form-select w-auto" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
//             {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
//           </select>

//           <select className="form-select w-auto" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
//             {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(y => <option key={y} value={y}>{y}</option>)}
//           </select>

//           <button className="btn btn-success" onClick={exportToExcel}>Export Excel</button>
//         </div>

//         {/* Summary card */}
//         <div className="alert alert-info fw-bold">
//           <h6 className="mb-2">Attendance Summary – {months[selectedMonth - 1]} {selectedYear}</h6>

//           Present: <span className="text-success">{summary.present || 0}</span> &nbsp; | &nbsp;
//           Absent: <span className="text-danger">{summary.absent || 0}</span> &nbsp; | &nbsp;
//           Leave: <span style={{ color: "orange" }}>{summary.leave || 0}</span> &nbsp; | &nbsp;
//           Holiday: <span style={{ color: "blue" }}>{summary.holiday || 0}</span> &nbsp; | &nbsp;
//           Half Day: <span style={{ color: "brown" }}>{summary.halfday || 0}</span>

//           <hr />

//           Paid Leave: <b>{summary.paidLeaves ?? 0}</b> &nbsp; | &nbsp;
//           Unpaid Leave: <b>{summary.unpaidLeaves ?? 0}</b> &nbsp; | &nbsp;
//           Late Count: <b>{summary.lateCount || 0}</b> &nbsp; | &nbsp;
//           Late Hours: <b>{summary.lateHours || 0}</b> hr &nbsp; | &nbsp;
//           Deduction: <b className="text-danger">{summary.deduction || 0}</b> days
//         </div>

//         {/* Legend */}
//         <div className="mt-4 px-2 mb-4">
//           <strong>Note:</strong> &nbsp;
//           <span style={{ marginRight: 8 }}>⭐ Holiday</span>
//           <span style={{ marginRight: 8 }}>✔ Present</span>
//           <span style={{ marginRight: 8 }}>✖ Absent</span>
//           <span style={{ marginRight: 8 }}>🛫  Leave</span>
//           {/* <span style={{ marginRight: 8 }}>🛫 (red) Unpaid Leave</span> */}
//           <span style={{ marginRight: 8 }}>⚠ Half Day</span>
//         </div>

//         {/* Attendance grid */}
//         <div className="card shadow-sm" style={{ marginLeft: "-25px" }}>
//           <div className="card-body" style={{ overflowX: "auto", whiteSpace: "nowrap", paddingBottom: "20px", paddingLeft: 0 }}>

//             {/* Header row: Employee + dates */}
//             <div className="d-flex fw-bold mb-2" style={{ marginLeft: 0 }}>
//               <div style={{ width: "110px", fontSize: "14px", paddingLeft: "5px" }}>Employee</div>

//               <div className="d-flex flex-grow-1" style={{ minWidth: `${daysInMonth * 35}px`, borderBottom: "1px solid #ccc" }}>
//                 {Array.from({ length: daysInMonth }).map((_, i) => (
//                   <div className="att-cell">
//                     {i + 1}
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Single employee row (you can expand this to multiple employees if needed) */}
//             <div className="d-flex align-items-center" style={{ marginLeft: 0 }}>
//               <div style={{ width: "110px", fontWeight: 600, fontSize: "14px", paddingLeft: "5px" }}>{user.ename}</div>

//               <div className="d-flex flex-grow-1" style={{ minWidth: `${daysInMonth * 35}px` }}>
//                 {Array.from({ length: daysInMonth }).map((_, i) => {
//                   // find attendance for this day
//                   const day = i + 1;
//                   const dateKey = (() => { const dd = String(day).padStart(2, '0'); const mm = String(selectedMonth).padStart(2, '0'); return `${selectedYear}-${mm}-${dd}`; })();

//                   // find matching item in attendanceData
//                   const att = attendanceData.find(a => {
//                     try {
//                       const ds = typeof a.date === 'string' ? a.date : new Date(a.date).toISOString().split('T')[0];
//                       return ds === dateKey;
//                     } catch (e) { return false; }
//                   });

//                   return (
//                     <div
//                       className={`att-cell ${att && att.isLateMinutes > 0 ? "att-late" : ""}`}
//                       onClick={() => att && openModal(att)}
//                       style={{ cursor: att ? "pointer" : "default", position: "relative" }}
//                       title={
//                         att && att.isLateMinutes > 0
//                           ? `Late by ${att.isLateMinutes} minutes`
//                           : ""
//                       }
//                     >
//                       {att ? (
//                         <>
//                           {/* icon */}
//                           <span style={{ fontSize: "18px" }}>{getIcon(att.status)}</span>

//                           {/* late indicator dot */}
//                           {att.isLateMinutes > 0 && <div className="late-dot"></div>}
//                         </>
//                       ) : (
//                         <span style={{ fontSize: "12px", color: "#aaa" }}>-</span>
//                       )}
//                     </div>

//                   );
//                 })}
//               </div>
//             </div>

//           </div>
//         </div>

//       </div>

//       {/* RIGHT SLIDE MODAL */}
//       {modalOpen && selectedAtt && (
//         <div style={{ position: "fixed", top: 0, right: 0, width: "350px", height: "100%", background: "white", boxShadow: "-4px 0 10px rgba(0,0,0,0.2)", padding: "20px", zIndex: 1000 }}>
//           <h4>Attendance Details</h4>
//           <hr />

//           <p><b>Date:</b> {selectedAtt.date}</p>
//           <p><b>Status:</b> {selectedAtt.status}</p>
//           <p><b>Check In:</b> {selectedAtt.check_in || "--"}</p>
//           <p><b>Check Out:</b> {selectedAtt.check_out || "--"}</p>

//           <p><b>Working Hours:</b> {selectedAtt.workingHours ? `${selectedAtt.workingHours} hrs` : (selectedAtt.check_in && selectedAtt.check_out ? (() => { const s = new Date(`${selectedAtt.date} ${selectedAtt.check_in}`); const e = new Date(`${selectedAtt.date} ${selectedAtt.check_out}`); return ((e - s) / 3600000).toFixed(2) + ' hrs'; })() : "--")}</p>

//           <button className="btn btn-danger mt-3" onClick={() => setModalOpen(false)}>Close</button>
//         </div>
//       )}
//     </>
//   );
// }

// export default EmployeeAttendance;

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_URL } from "../../../config";

// Month names used for display
const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function EmployeeAttendance() {
  // Current logged-in user (from localStorage)
  const user = JSON.parse(localStorage.getItem("user"));

  // State
  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAtt, setSelectedAtt] = useState(null);

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  // =========================
  // Fetch monthly attendance
  // =========================
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/monthly`, {
        params: {
          employeeId: user._id,
          month: selectedMonth,
          year: selectedYear
        }
      });

      setAttendanceData(res.data.data || []);
      setSummary(res.data.summary || {});
    } catch (error) {
      console.error("Attendance Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
    // eslint-disable-next-line
  }, [selectedMonth, selectedYear]);

  // -----------------------------------
  // ICON HELPER with Late Emoji Support
  // -----------------------------------
  const getIcon = (status, isLateMinutes = 0) => {
    if (!status) return "-";

    const s = status.toString().trim().toLowerCase();
    const lateIcon = isLateMinutes > 0 ? "⏰ " : ""; // late indicator emoji

    switch (s) {
      case "present":
        return <span style={{ fontSize: "20px", color: "green" }}>{lateIcon}✔</span>;

      case "absent":
        return <span style={{ fontSize: "20px", color: "red" }}>✖</span>;

      case "holiday":
        return <span style={{ fontSize: "20px", color: "gold" }}>⭐</span>;

      case "paid leave":
        return <span style={{ fontSize: "20px", color: "green" }}>🛫</span>;

      case "unpaid leave":
        return <span style={{ fontSize: "20px", color: "red" }}>🛫</span>;

      case "half day":
        return (
          <span style={{ fontSize: "20px", color: "orange" }}>
            {lateIcon}⚠
          </span>
        );

      case "paid half day":
      case "paid_halfday":
        return (
          <span>
            {lateIcon}
            <span style={{ color: "green", fontSize: "18px", marginRight: 2 }}>🛫</span>
            <span style={{ color: "orange", fontSize: "18px" }}>⚠</span>
          </span>
        );

      case "unpaid half day":
      case "unpaid_halfday":
        return (
          <span>
            {lateIcon}
            <span style={{ color: "red", fontSize: "18px", marginRight: 2 }}>🛫</span>
            <span style={{ color: "orange", fontSize: "18px" }}>⚠</span>
          </span>
        );

      default:
        return "-";
    }
  };

  // -------------------------
  // Export to Excel
  // -------------------------
  const exportToExcel = () => {
    const header = ["Employee"];
    for (let d = 1; d <= daysInMonth; d++) header.push(String(d));
    const row = [user.ename];

    for (let d = 1; d <= daysInMonth; d++) {
      const att = attendanceData.find((a) => {
        try {
          const day = new Date(a.date).getDate();
          return day === d;
        } catch {
          return false;
        }
      });

      row.push(att ? att.status : "");
    }

    const ws1 = XLSX.utils.aoa_to_sheet([header, row]);
    const detailHeader = ["Date", "Status", "Check In", "Check Out", "Working Hours"];
    const detailRows = [detailHeader];

    for (let d = 1; d <= daysInMonth; d++) {
      const dd = String(d).padStart(2, "0");
      const mm = String(selectedMonth).padStart(2, "0");
      const dateKey = `${selectedYear}-${mm}-${dd}`;

      const att = attendanceData.find((a) => {
        try {
          const ds =
            typeof a.date === "string"
              ? a.date
              : new Date(a.date).toISOString().split("T")[0];
          return ds === dateKey;
        } catch {
          return false;
        }
      });

      detailRows.push([
        dateKey,
        att ? att.status : "",
        att ? att.check_in || "" : "",
        att ? att.check_out || "" : "",
        att ? att.workingHours || "" : ""
      ]);
    }

    const ws2 = XLSX.utils.aoa_to_sheet(detailRows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");
    XLSX.utils.book_append_sheet(wb, ws2, "Detail");
    XLSX.writeFile(wb, `${user.ename}_Attendance_${months[selectedMonth - 1]}_${selectedYear}.xlsx`);
  };

  const openModal = (att) => {
    setSelectedAtt(att);
    setModalOpen(true);
  };

  const modalOverlay = modalOpen
    ? {
        backdropFilter: "blur(5px)",
        background: "rgba(0,0,0,0.15)",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 999,
      }
    : {};

  return (
    <>
      {modalOpen && <div style={modalOverlay} onClick={() => setModalOpen(false)} />}

      <div className="container mt-4">

        {/* Dropdown Controls */}
        <div className="d-flex gap-3 align-items-center mb-4">
          <select className="form-select w-auto" value={selectedMonth} onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {months.map((m, i) => (
              <option key={i} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select className="form-select w-auto" value={selectedYear} onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>

          <button className="btn btn-success" onClick={exportToExcel}>
            Export Excel
          </button>
        </div>

        {/* Summary Card */}
        <div className="alert alert-info fw-bold">
          <h6>Attendance Summary – {months[selectedMonth - 1]} {selectedYear}</h6>
          Present: {summary.present || 0} |
          Absent: {summary.absent || 0} |
          Leave: {summary.leave || 0} |
          Holiday: {summary.holiday || 0} |
          Half Day: {summary.halfday || 0}
          <hr />
          Paid Leave: {summary.paidLeaves || 0} |
          Unpaid Leave: {summary.unpaidLeaves || 0} |
          Late Count: {summary.lateCount || 0} |
          Late Hours: {summary.lateHours || 0}
        </div>

        {/* Legends */}
        <div className="mt-4 px-2 mb-4">
          <strong>Note:</strong> ⭐ Holiday | ✔ Present | ✖ Absent | 🛫 Leave | ⚠ Half Day | ⏰ Late
        </div>

        {/* Attendance Grid */}
        <div className="card shadow-sm" style={{ marginLeft: "-25px" }}>
          <div className="card-body" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>

            {/* Header */}
            <div className="d-flex fw-bold mb-2">
              <div style={{ width: "110px" }}>Employee</div>
              <div className="d-flex flex-grow-1" style={{ minWidth: `${daysInMonth * 35}px` }}>
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <div className="att-cell">{i + 1}</div>
                ))}
              </div>
            </div>

            {/* Row */}
            <div className="d-flex align-items-center">
              <div style={{ width: "110px", fontWeight: 600 }}>{user.ename}</div>

              <div className="d-flex flex-grow-1" style={{ minWidth: `${daysInMonth * 35}px` }}>
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const dd = String(day).padStart(2, "0");
                  const mm = String(selectedMonth).padStart(2, "0");
                  const dateKey = `${selectedYear}-${mm}-${dd}`;

                  const att = attendanceData.find((a) => {
                    try {
                      const ds = new Date(a.date).toISOString().split("T")[0];
                      return ds === dateKey;
                    } catch {
                      return false;
                    }
                  });

                  return (
                    <div
                      className={`att-cell ${att && att.isLateMinutes > 0 ? "att-late" : ""}`}
                      onClick={() => att && openModal(att)}
                      style={{ cursor: att ? "pointer" : "default", position: "relative" }}
                      title={att && att.isLateMinutes > 0 ? `Late by ${att.isLateMinutes} minutes` : ""}
                    >
                      {att ? (
                        <>
                          <span style={{ fontSize: "18px" }}>{getIcon(att.status, att.isLateMinutes)}</span>
                          {att.isLateMinutes > 0 && <div className="late-dot"></div>}
                        </>
                      ) : (
                        <span style={{ color: "#aaa" }}>-</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Modal */}
      {modalOpen && selectedAtt && (
        <div style={{ position: "fixed", top: 0, right: 0, width: "350px", height: "100%", background: "white", padding: "20px", zIndex: 1000 }}>
          <h4>Attendance Details</h4>
          <hr />
          <p><b>Date:</b> {selectedAtt.date}</p>
          <p><b>Status:</b> {selectedAtt.status}</p>
          <p><b>Check In:</b> {selectedAtt.check_in || "--"}</p>
          <p><b>Check Out:</b> {selectedAtt.check_out || "--"}</p>
          <p><b>Late By:</b> {selectedAtt.isLateMinutes || 0} minutes</p>
          <button className="btn btn-danger mt-3" onClick={() => setModalOpen(false)}>Close</button>
        </div>
      )}
    </>
  );
}

export default EmployeeAttendance;
