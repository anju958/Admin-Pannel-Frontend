import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import * as XLSX from "xlsx";

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function Attendance() {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [attendanceData, setAttendanceData] = useState([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedAtt, setSelectedAtt] = useState(null);

  const [timingModal, setTimingModal] = useState(false);
  const [selectedEmpForTiming, setSelectedEmpForTiming] = useState(null);
  const [timing, setTiming] = useState({
    officeStart: "",
    officeEnd: "",
    graceMinutes: "",
    dailyWorkingHours: ""
  });

  const daysInMonth = new Date(selectedYear, selectedMonth, 0).getDate();

  // Fetch all employees monthly attendance
  const fetchMonthlyData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getMonthlyAttandenceByAdmin`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error(err);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
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

  const filteredEmployees = attendanceData.filter((emp) =>
    emp.ename.toLowerCase().includes(search.toLowerCase())
  );

  const openModal = (att) => {
    setSelectedAtt(att);
    setModalOpen(true);
  };

  const openEditTiming = (emp) => {
    setSelectedEmpForTiming(emp);

    setTiming({
      officeStart: emp.officeStart || "09:30",
      officeEnd: emp.officeEnd || "18:30",
      graceMinutes: emp.graceMinutes || 10,
      dailyWorkingHours: emp.dailyWorkingHours || 9
    });

    setTimingModal(true);
  };

  const saveTiming = async () => {
    try {
      await axios.put( `${API_URL}/api/updateOfficeTiming/${selectedEmpForTiming.empId}`, timing);

      alert("Office timing updated successfully!");
      setTimingModal(false);
      fetchMonthlyData();
    } catch (error) {
      console.error(error);
      alert("Failed to update timing");
    }
  };

  return (
    <>
      <div className="container mt-4">

        <h3>Admin – Monthly Attendance</h3>

        {/* Filters */}
        <div className="d-flex gap-3 my-3 align-items-center">
          <select
            className="form-select w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>

          <select
            className="form-select w-auto"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>

          <input
            type="text"
            className="form-control w-25"
            placeholder="Search Employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button className="btn btn-success">Export Excel</button>
        </div>

        {/* NOTE LEGEND */}
        <div className="mt-2 mb-4" style={{ fontSize: "15px" }}>
          <strong>Note:</strong>&nbsp;
          ⭐ Holiday &nbsp; | &nbsp;
          ✔ Present &nbsp; | &nbsp;
          ✖ Absent &nbsp; | &nbsp;
          🛫 Leave &nbsp; | &nbsp;
          ⚠ Half Day &nbsp; | &nbsp;
          <span style={{ color: "red" }}>● Late</span>
        </div>

        {/* Employee Cards */}
        <div className="card shadow-sm">
          <div className="card-body" style={{ overflowX: "auto" }}>

            {filteredEmployees.map((emp, idx) => (
              <div key={idx} className="card shadow-sm mb-4 p-4">

                {/* Title Row */}
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold">{emp.ename}</h5>

                  {/* Edit Timing Button */}
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openEditTiming(emp)}
                  >
                    Edit Timing
                  </button>
                </div>

                {/* Employee Timing Info */}
                <p className="mt-1 mb-2 text-muted" style={{ fontSize: "14px" }}>
                  Office: {emp.officeStart || "09:30"} → {emp.officeEnd || "18:30"}
                  &nbsp; | &nbsp; Grace: {emp.graceMinutes || 10}m
                  &nbsp; | &nbsp; Hours: {emp.dailyWorkingHours || 9}
                </p>

                {/* Summary */}
                {emp.summary && (
                  <div className="mb-3" style={{ fontSize: "14px" }}>
                    <b>Summary:</b>&nbsp;
                    Present: <span className="text-success">{emp.summary.present}</span> &nbsp; | &nbsp;
                    Absent: <span className="text-danger">{emp.summary.absent}</span> &nbsp; | &nbsp;
                    Half Day: {emp.summary.halfday} &nbsp; | &nbsp;
                    Holiday: {emp.summary.holiday} &nbsp; | &nbsp;
                    Paid Leave: {emp.summary.paidLeaves} &nbsp; | &nbsp;
                    Unpaid Leave: {emp.summary.unpaidLeaves} &nbsp; | &nbsp;
                    Late: {emp.summary.lateCount} days &nbsp; | &nbsp;
                    Late Hours: {emp.summary.lateHours} hr
                  </div>
                )}

                {/* Date Headers */}
                <div className="d-flex fw-bold mb-2">
                  <div style={{ width: "150px" }}>Date</div>
                  <div className="d-flex" style={{ minWidth: `${daysInMonth * 35}px` }}>
                    {Array.from({ length: daysInMonth }).map((_, i) => (
                      <div key={i} style={{ width: "35px", textAlign: "center", borderBottom: "1px solid #ccc" }}>
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance Row */}
                <div className="d-flex align-items-center">
                  <div style={{ width: "150px", fontWeight: 600 }}>Status</div>

                  <div className="d-flex" style={{ minWidth: `${daysInMonth * 35}px` }}>
                    {emp.attendance.map((att, index) => (
                      <div
                        key={index}
                        onClick={() => openModal({ ...att, ename: emp.ename })}
                        style={{
                          width: "35px",
                          height: "35px",
                          textAlign: "center",
                          position: "relative",
                          cursor: "pointer",
                          fontSize: "18px"
                        }}
                        title={
                          att.isLateMinutes > 0
                            ? `Late by ${att.isLateMinutes} minutes`
                            : ""
                        }
                      >
                        {getIcon(att.status)}

                        {/* Red Late Dot */}
                        {att.isLateMinutes > 0 && (
                          <span style={{
                            position: "absolute",
                            top: "2px",
                            right: "6px",
                            width: "7px",
                            height: "7px",
                            background: "red",
                            borderRadius: "50%"
                          }}></span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            ))}

          </div>
        </div>
      </div>

      {/* Right Slide Modal */}
      {modalOpen && selectedAtt && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "350px",
            height: "100%",
            background: "#fff",
            padding: "20px",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.3)"
          }}
        >
          <h4>{selectedAtt.ename} - Details</h4>
          <hr />
          <p><b>Date:</b> {selectedAtt.date}</p>
          <p><b>Status:</b> {selectedAtt.status}</p>
          <p><b>Check-in:</b> {selectedAtt.check_in || "--"}</p>
          <p><b>Check-out:</b> {selectedAtt.check_out || "--"}</p>

          {selectedAtt.isLateMinutes > 0 && (
            <p><b>Late:</b> {selectedAtt.isLateMinutes} minutes</p>
          )}

          <button className="btn btn-danger mt-3" onClick={() => setModalOpen(false)}>
            Close
          </button>
        </div>
      )}

      {/* TIMING EDIT MODAL */}
      {timingModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            right: 0,
            width: "350px",
            height: "100%",
            background: "#fff",
            padding: "25px",
            boxShadow: "-4px 0 10px rgba(0,0,0,0.3)"
          }}
        >
          <h4>Edit Office Timing</h4>
          <hr />

          <label>Office Start</label>
          <input type="time" className="form-control mb-2"
            value={timing.officeStart}
            onChange={(e) => setTiming({ ...timing, officeStart: e.target.value })}
          />

          <label>Office End</label>
          <input type="time" className="form-control mb-2"
            value={timing.officeEnd}
            onChange={(e) => setTiming({ ...timing, officeEnd: e.target.value })}
          />

          <label>Grace Minutes</label>
          <input type="number" className="form-control mb-2"
            value={timing.graceMinutes}
            onChange={(e) => setTiming({ ...timing, graceMinutes: e.target.value })}
          />

          <label>Daily Working Hours</label>
          <input type="number" className="form-control mb-3"
            value={timing.dailyWorkingHours}
            onChange={(e) => setTiming({ ...timing, dailyWorkingHours: e.target.value })}
          />

          <button className="btn btn-primary w-100 mb-2" onClick={saveTiming}>
            Save Timing
          </button>

          <button className="btn btn-secondary w-100" onClick={() => setTimingModal(false)}>
            Cancel
          </button>
        </div>
      )}
    </>
  );
}

export default Attendance;
