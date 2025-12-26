

import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_URL } from "../../../config";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function EmployeeAttendance() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
const employeeId = user.employeeId || user._id;

  const [attendanceData, setAttendanceData] = useState([]);
  const [summary, setSummary] = useState({});
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAtt, setSelectedAtt] = useState(null);

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  const getDateKey = (d) => {
  if (!d) return null;
  return new Date(d).toISOString().split("T")[0];
};

  const fetchAttendance = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/monthly`, {
        params: {
          employeeId,
          month: selectedMonth,
          year: selectedYear
        }
      });

      setAttendanceData(res.data.data || []);
      setSummary(res.data.summary || {});
      console.log("Attendance API response:", res.data.data);
    } catch (error) {
      console.error("Attendance Fetch Error:", error);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, [selectedMonth, selectedYear]);

  const getIcon = (status) => {
    if (!status) return "-";
    const s = status.toLowerCase();

    if (s === "present") return "✔";
    if (s === "absent") return "✖";
    if (s === "holiday") return "⭐";
    if (s === "paid leave") return "🛫";
    if (s === "unpaid leave") return "🛫";
    if (s.includes("half")) return "⚠";
    return "-";
  };

  const openModal = (att) => {
    setSelectedAtt(att);
    setModalOpen(true);
  };

  const exportToExcel = () => {
    const header = ["Employee"];
    for (let d = 1; d <= daysInMonth; d++) header.push(String(d));

    const row = [user.ename];

    for (let d = 1; d <= daysInMonth; d++) {
      const dateKey = `${selectedYear}-${String(selectedMonth).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const att = attendanceData.find(a => getDateKey(a.date) === dateKey);

      row.push(att ? att.status : "");
    }

    const ws1 = XLSX.utils.aoa_to_sheet([header, row]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws1, "Summary");
    XLSX.writeFile(wb, `${user.ename}_Attendance_${months[selectedMonth - 1]}_${selectedYear}.xlsx`);
  };

  return (
    <>
      {modalOpen && (
        <div
          style={{
            backdropFilter: "blur(5px)",
            background: "rgba(0,0,0,0.15)",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            zIndex: 999,
          }}
          onClick={() => setModalOpen(false)}
        />
      )}

      <div className="container mt-4">

        {/* Header Controls */}
        <div className="d-flex gap-3 align-items-center mb-4">
          <select className="form-select w-auto" value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}>
            {months.map((m, i) => <option key={i} value={i + 1}>{m}</option>)}
          </select>

          <select className="form-select w-auto" value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}>
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((y) =>
              <option key={y} value={y}>{y}</option>
            )}
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

        {/* Notes */}
        <div className="mt-4 px-2 mb-4">
          <strong>Note:</strong> ⭐ Holiday | ✔ Present | ✖ Absent | 🛫 Leave | ⚠ Half Day | <span style={{ color: "red" }}>● Late</span>
        </div>

        {/* Attendance Grid */}
        <div className="card shadow-sm" style={{ marginLeft: "-25px" }}>
          <div className="card-body" style={{ overflowX: "auto", whiteSpace: "nowrap" }}>

            <div className="d-flex fw-bold mb-2">
              <div style={{ width: "110px" }}>Employee</div>
              <div className="d-flex flex-grow-1">
                {Array.from({ length: daysInMonth }).map((_, i) => (
                  <div className="att-cell" key={i}>{i + 1}</div>
                ))}
              </div>
            </div>

            {/* Attendance Row */}
            <div className="d-flex align-items-center">
              <div style={{ fontWeight: 400 }}>{user.ename}</div>

              <div className="d-flex flex-grow-1">
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = String(i + 1).padStart(2, "0");
                  const mm = String(selectedMonth).padStart(2, "0");
                  const dateKey = `${selectedYear}-${mm}-${day}`;

                  const att = attendanceData.find(a => getDateKey(a.date) === dateKey);

                  return (
                    <div
                      key={i}   // FIXED
                      className="att-cell"
                      onClick={() => att && openModal(att)}
                      style={{
                        cursor: att ? "pointer" : "default",
                        position: "relative",
                        fontSize: "20px",
                        textAlign: "center"
                      }}
                    >
                      {att ? getIcon(att.status) : <span style={{ color: "#aaa" }}>-</span>}

                      {/* RED DOT FOR LATE */}
                      {att?.isLateMinutes > 0 && (
                        <span style={{
                          position: "absolute",
                          top: "3px",
                          right: "6px",
                          width: "7px",
                          height: "7px",
                          background: "red",
                          borderRadius: "50%"
                        }}></span>
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
        <div style={{
          position: "fixed",
          top: 0,
          right: 0,
          width: "350px",
          height: "100%",
          background: "white",
          padding: "20px",
          zIndex: 1000
        }}>
          <h4>Attendance Details</h4>
          <hr />
          <p><b>Date:</b> {selectedAtt.date}</p>
          <p><b>Status:</b> {selectedAtt.status}</p>
          <p><b>Check In:</b> {selectedAtt.check_in || "--"}</p>
          <p><b>Check Out:</b> {selectedAtt.check_out || "--"}</p>
          <p><b>Late By:</b> {selectedAtt.isLateMinutes || 0} minutes</p>

          <button className="btn btn-danger mt-3" onClick={() => setModalOpen(false)}>
            Close
          </button>
        </div>
      )}

    </>
  );
}

export default EmployeeAttendance;
