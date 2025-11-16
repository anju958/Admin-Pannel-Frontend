import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_URL } from "../../../config";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function EmployeeAttendance() {

  const user = JSON.parse(localStorage.getItem("user"));

  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  // ================================
  // FETCH ATTENDANCE
  // ================================
  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/monthly`, {
        params: {
          employeeId: user._id,
          month: selectedMonth,
          year: selectedYear
        }
      });

      setAttendanceData(res.data.data || []);   // <-- FIXED
      setSummary(res.data.summary || {});       // <-- NEW

    } catch (error) {
      console.error("Attendance Fetch Error:", error);
      setAttendanceData([]);
    }
  };


  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);


  // ================================
  // ICON GENERATOR
  // ================================
  const getIcon = (status) => {
    if (!status) return "-";
    switch (status.toLowerCase()) {
      case "present": return <span className="text-success fw-bold">✔</span>;
      case "absent": return <span className="text-danger fw-bold">✖</span>;
      case "leave": return <span style={{ color: "red" }}>🛫</span>;
      case "holiday": return <span className="text-warning fw-bold">⭐</span>;
      case "half day": return <span className="text-primary fw-bold">⚠</span>;
      default: return "-";
    }
  };


  // ================================
  // BACKGROUND COLORS
  // ================================
  const getBgColor = (status) => {
    if (!status) return "transparent";

    switch (status.toLowerCase()) {
      case "present": return "#d4f8d4";
      case "absent": return "#ffd6d6";
      case "leave": return "#fff2c2";
      case "holiday": return "#d9eaff";
      case "half day": return "#ffeac7";
      default: return "transparent";
    }
  };


  // ================================
  // EXPORT TO EXCEL
  // ================================
  const exportToExcel = () => {
    const row = { Employee: user.ename };

    for (let i = 1; i <= daysInMonth; i++) {
      const att = attendanceData.find(a => new Date(a.date).getDate() === i);
      row[i] = att ? att.status : "";
    }

    const ws = XLSX.utils.json_to_sheet([row]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");
    XLSX.writeFile(wb, `${user.ename}-Attendance.xlsx`);
  };


  // ================================
  // RENDER
  // ================================
  return (
    <div className="container mt-4">

      {/* Month-Year Selection */}
      <div className="d-flex gap-3 align-items-center mb-4">
        <select className="form-select w-auto"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(Number(e.target.value))}
        >
          {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
        </select>

        <select className="form-select w-auto"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i)
            .map((y) => <option key={y} value={y}>{y}</option>)}
        </select>

        <button className="btn btn-success" onClick={exportToExcel}>
          Export Excel
        </button>
      </div>


      {/* SUMMARY CARD */}
      <div className="alert alert-info fw-bold">
        <h6 className="mb-2">
          Attendance Summary – {months[selectedMonth - 1]} {selectedYear}
        </h6>

        Present: <span className="text-success">{summary.present}</span> &nbsp; | &nbsp;
        Absent: <span className="text-danger">{summary.absent}</span> &nbsp; | &nbsp;
        Leave: <span style={{ color: "orange" }}>{summary.leave}</span> &nbsp; | &nbsp;
        Holiday: <span style={{ color: "blue" }}>{summary.holiday}</span> &nbsp; | &nbsp;
        Half Day: <span style={{ color: "brown" }}>{summary.halfday}</span>

        <hr />

        Late Count: <b>{summary.lateCount}</b> times &nbsp; | &nbsp;
        Late Hours: <b>{summary.lateHours}</b> hr &nbsp; | &nbsp;
        Deduction: <b className="text-danger">{summary.deduction}</b> day(s)
      </div>


      {/* NOTES */}
      <div className="mt-4 px-2 mb-4">
        <strong>Note:</strong>{" "}
        ⭐ → Holiday &nbsp;&nbsp;
        ✔ → Present &nbsp;&nbsp;
        ✖ → Absent &nbsp;&nbsp;
        🛫 → Leave &nbsp;&nbsp;
        ⚠ → Half Day
      </div>


      {/* ATTENDANCE TABLE */}
      <div className="card shadow-sm">
        <div className="card-body" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>

          {/* HEADER */}
          <div className="d-flex fw-bold mb-3">
            <div style={{ width: "160px" }}>Employee</div>
            <div className="d-flex flex-grow-1" style={{ minWidth: `${daysInMonth * 60}px`, gap: "1.5px"  }}>
              {Array.from({ length: daysInMonth }).map((_, i) => (
                <div key={i} className="text-center" style={{ width: "60px" }}>
                  {i + 1}
                </div>
              ))}
            </div>
          </div>

          <hr />

          {/* ROW */}
          <div className="d-flex align-items-center">

            <div style={{ width: "160px" }}>
              <b>{user.ename}</b>
            </div>

            <div className="d-flex flex-grow-1" style={{ minWidth: `${daysInMonth * 60}px` , gap: "1.8px" }}>

              {Array.from({ length: daysInMonth }).map((_, i) => {
                const att = attendanceData.find(a => new Date(a.date).getDate() === i + 1);

                return (
                  <div
                    key={i}
                    className="text-center"
                    style={{
                      width: "60px",
                      minWidth: "60px",
                      padding: "4px",
                      borderRadius: "8px",
                      background: att ? getBgColor(att.status) : "transparent",
                      boxShadow: att ? "0 0 5px rgba(0,0,0,0.1)" : "none",
                      fontSize: "11px",
                      cursor: "pointer",
                      lineHeight: "14px"
                    }}
                    title={
                      att
                        ? `Status: ${att.status}
                          IN: ${att.check_in || "--"}
                          OUT: ${att.check_out || "--"}`
                        : "No data"
                    }
                  >
                    {att ? (
                      <>
                        {/* STATUS LABEL */}
                        <div style={{ fontWeight: "600" }}>
                          {getIcon(att.status)}
                          {" "}
                          {att.status === "Present" && "Present"}
                          {att.status === "Absent" && "Absent"}
                          {att.status === "Leave" && "Leave"}
                          {att.status === "Holiday" && "Holiday"}
                          {att.status === "Half Day" && "Half Day"}
                        </div>

                        {/* TIME BLOCK */}
                        {att.status !== "Absent" && att.status !== "Holiday" && (
                          <div style={{ marginTop: "3px", fontSize: "10px" }}>
                            <div>IN: {att.check_in ? att.check_in.slice(0, 5) : "--"}</div>
                            <div>OUT: {att.check_out ? att.check_out.slice(0, 5) : "--"}</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <span style={{ color: "#777" }}>-</span>
                    )}
                  </div>

                );
              })}

            </div>
          </div>

        </div>
      </div>

    </div>
  );
}

export default EmployeeAttendance;
