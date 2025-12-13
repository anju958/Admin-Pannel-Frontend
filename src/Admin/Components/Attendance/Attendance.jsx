
import React, { useEffect, useState, useMemo } from "react";
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

  const [showHolidayModal, setShowHolidayModal] = useState(false);
  const [holidayDate, setHolidayDate] = useState("");
  const [holidayTitle, setHolidayTitle] = useState("");
  const [holidayDescription, setHolidayDescription] = useState("");

  const [timingModal, setTimingModal] = useState(false);
  const [selectedEmpForTiming, setSelectedEmpForTiming] = useState(null);
  const [timing, setTiming] = useState({
    officeStart: "",
    officeEnd: "",
    graceMinutes: "",
    dailyWorkingHours: ""
  });

  const daysInMonth = useMemo(
    () => new Date(selectedYear, selectedMonth, 0).getDate(),
    [selectedYear, selectedMonth]
  );

  /* -----------------------------------------------------
     FETCH MONTHLY ATTENDANCE (ADMIN)
  ----------------------------------------------------- */
  const fetchMonthlyData = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getMonthlyAttandenceByAdmin`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      setAttendanceData(res.data || []);
    } catch (err) {
      console.error("Monthly attendance fetch error:", err);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    fetchMonthlyData();
  }, [selectedMonth, selectedYear]);

  /* -----------------------------------------------------
     ICON HELPER (ADMIN STYLE)
  ----------------------------------------------------- */
  const getIcon = (status) => {
    if (!status) return "-";
    const s = String(status).toLowerCase();

    if (s === "present") return "✔";
    if (s === "absent") return "✖";
    if (s === "holiday") return "⭐";
    if (s === "paid leave") return "🛫";
    if (s === "unpaid leave") return "🛫";
    if (s.includes("half")) return "⚠";

    return "-";
  };

  /* -----------------------------------------------------
     FILTER EMPLOYEES BY SEARCH
  ----------------------------------------------------- */
  const filteredEmployees = useMemo(
    () =>
      attendanceData.filter((emp) =>
        (emp.ename || "").toLowerCase().includes(search.toLowerCase())
      ),
    [attendanceData, search]
  );

  /* -----------------------------------------------------
     MODAL HANDLERS
  ----------------------------------------------------- */
  const openDetailsModal = (attWithName) => {
    setSelectedAtt(attWithName);
    setModalOpen(true);
  };

  const closeDetailsModal = () => {
    setSelectedAtt(null);
    setModalOpen(false);
  };

  const openEditTiming = (emp) => {
    setSelectedEmpForTiming(emp);

    setTiming({
      officeStart: emp.officeStart || "09:30",
      officeEnd: emp.officeEnd || "18:30",
      graceMinutes: emp.graceMinutes ?? 10,
      dailyWorkingHours: emp.dailyWorkingHours ?? 9
    });

    setTimingModal(true);
  };

  const closeTimingModal = () => {
    setSelectedEmpForTiming(null);
    setTimingModal(false);
  };

  /* -----------------------------------------------------
     SAVE EMPLOYEE OFFICE TIMING
  ----------------------------------------------------- */
  const saveTiming = async () => {
    if (!selectedEmpForTiming) return;

    try {
      await axios.put(
        `${API_URL}/api/updateOfficeTiming/${selectedEmpForTiming.empId}`,
        timing
      );

      alert("Office timing updated successfully!");
      setTimingModal(false);
      fetchMonthlyData();
    } catch (error) {
      console.error("Update timing error:", error);
      alert("Failed to update timing");
    }
  };

  /* -----------------------------------------------------
     ADD HOLIDAY (IMMEDIATE EFFECT)
  ----------------------------------------------------- */
  const addHoliday = async () => {
    if (!holidayDate || !holidayTitle.trim()) {
      alert("Please select date and title");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/holiday`, {
        date: holidayDate,
        title: holidayTitle,
        description: holidayDescription,
        isPaid: true
      });

      alert("Holiday added successfully!");

      setShowHolidayModal(false);
      setHolidayDate("");
      setHolidayTitle("");
      setHolidayDescription("");

      // Refresh attendance so holiday appears immediately
      fetchMonthlyData();
    } catch (error) {
      console.error("Add holiday error:", error);
      alert(error.response?.data?.message || "Error adding holiday");
    }
  };

  /* -----------------------------------------------------
     EXPORT EXCEL
  ----------------------------------------------------- */
  const exportToExcel = () => {
    if (!attendanceData || attendanceData.length === 0) {
      alert("No data to export");
      return;
    }

    const header = ["Employee"];
    for (let d = 1; d <= daysInMonth; d++) header.push(String(d));

    const rows = attendanceData.map((emp) => {
      const row = [emp.ename || ""];

      for (let d = 0; d < daysInMonth; d++) {
        const att = emp.attendance?.[d];
        row.push(att ? att.status || "" : "");
      }
      return row;
    });

    const ws = XLSX.utils.aoa_to_sheet([header, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Attendance");

    XLSX.writeFile(
      wb,
      `Attendance_${months[selectedMonth - 1]}_${selectedYear}.xlsx`
    );
  };

  /* -----------------------------------------------------
     RENDER
  ----------------------------------------------------- */
  return (
    <>
      <div className="container mt-4">
        <h3>Admin – Monthly Attendance</h3>

        {/* Filters & Actions */}
        <div className="d-flex gap-3 my-3 align-items-center flex-wrap">
          <select
            className="form-select w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {months.map((m, i) => (
              <option key={m} value={i + 1}>
                {m}
              </option>
            ))}
          </select>

          <select
            className="form-select w-auto"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 6 }, (_, i) => new Date().getFullYear() - i).map(
              (y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              )
            )}
          </select>

          <input
            type="text"
            className="form-control w-25"
            placeholder="Search Employee..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <button
            className="btn btn-light"
            onClick={() => setShowHolidayModal(true)}
          >
            + Add Holiday
          </button>

          <button className="btn btn-success" onClick={exportToExcel}>
            Export Excel
          </button>
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
            {filteredEmployees.length === 0 && (
              <div className="text-muted text-center py-4">
                No employees found for this month/year or search.
              </div>
            )}

            {filteredEmployees.map((emp) => (
              <div key={emp.empId} className="card shadow-sm mb-4 p-4">
                {/* Title Row */}
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="fw-bold mb-0">{emp.ename}</h5>

                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => openEditTiming(emp)}
                  >
                    Edit Timing
                  </button>
                </div>

                {/* Employee Timing Info */}
                <p
                  className="mt-1 mb-2 text-muted"
                  style={{ fontSize: "14px" }}
                >
                  Office: {emp.officeStart || "09:30"} →{" "}
                  {emp.officeEnd || "18:30"}
                  &nbsp; | &nbsp; Grace: {emp.graceMinutes ?? 10}m &nbsp; | &nbsp;
                  Hours: {emp.dailyWorkingHours ?? 9}
                </p>

                {/* Summary */}
                {emp.summary && (
                  <div className="mb-3" style={{ fontSize: "14px" }}>
                    <b>Summary:</b>&nbsp;
                    Present:{" "}
                    <span className="text-success">
                      {emp.summary.present || 0}
                    </span>{" "}
                    &nbsp; | &nbsp;
                    Absent:{" "}
                    <span className="text-danger">
                      {emp.summary.absent || 0}
                    </span>{" "}
                    &nbsp; | &nbsp;
                    Half Day: {emp.summary.halfday || 0} &nbsp; | &nbsp; Holiday:{" "}
                    {emp.summary.holiday || 0} &nbsp; | &nbsp; Paid Leave:{" "}
                    {emp.summary.paidLeaves || 0} &nbsp; | &nbsp; Unpaid Leave:{" "}
                    {emp.summary.unpaidLeaves || 0} &nbsp; | &nbsp; Late:{" "}
                    {emp.summary.lateCount || 0} days &nbsp; | &nbsp; Late Hours:{" "}
                    {emp.summary.lateHours || 0} hr
                  </div>
                )}

                {/* Date Headers */}
                <div className="d-flex fw-bold mb-2">
                  <div style={{ width: "150px" }}>Date</div>
                  <div
                    className="d-flex"
                    style={{ minWidth: `${daysInMonth * 35}px` }}
                  >
                    {Array.from({ length: daysInMonth }).map((_, i) => (
                      <div
                        key={i + 1}
                        style={{
                          width: "35px",
                          textAlign: "center",
                          borderBottom: "1px solid #ccc"
                        }}
                      >
                        {i + 1}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Attendance Row */}
                <div className="d-flex align-items-center">
                  <div style={{ width: "150px", fontWeight: 600 }}>Status</div>

                  <div
                    className="d-flex"
                    style={{ minWidth: `${daysInMonth * 35}px` }}
                  >
                    {Array.from({ length: daysInMonth }).map((_, index) => {
                      const att = emp.attendance?.[index];

                      return (
                        <div
                          key={index}
                          onClick={() =>
                            att &&
                            openDetailsModal({
                              ...att,
                              ename: emp.ename
                            })
                          }
                          style={{
                            width: "35px",
                            height: "35px",
                            textAlign: "center",
                            position: "relative",
                            cursor: att ? "pointer" : "default",
                            fontSize: "18px"
                          }}
                          title={
                            att?.isLateMinutes > 0
                              ? `Late by ${att.isLateMinutes} minutes`
                              : att?.status || ""
                          }
                        >
                          {att ? getIcon(att.status) : "-"}

                          {att?.isLateMinutes > 0 && (
                            <span
                              style={{
                                position: "absolute",
                                top: "2px",
                                right: "6px",
                                width: "7px",
                                height: "7px",
                                background: "red",
                                borderRadius: "50%"
                              }}
                            />
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Slide Attendance Detail Modal */}
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
            boxShadow: "-4px 0 10px rgba(0,0,0,0.3)",
            zIndex: 1100
          }}
        >
          <h4>{selectedAtt.ename} - Details</h4>
          <hr />
          <p>
            <b>Date:</b> {selectedAtt.date}
          </p>
          <p>
            <b>Status:</b> {selectedAtt.status}
          </p>
          <p>
            <b>Check-in:</b> {selectedAtt.check_in || "--"}
          </p>
          <p>
            <b>Check-out:</b> {selectedAtt.check_out || "--"}
          </p>
          <p>
            <b>Working Hours:</b>{" "}
            {selectedAtt.workingHours != null
              ? selectedAtt.workingHours
              : "--"}
          </p>
          {selectedAtt.isLateMinutes > 0 && (
            <p>
              <b>Late:</b> {selectedAtt.isLateMinutes} minutes
            </p>
          )}

          <button
            className="btn btn-danger mt-3"
            onClick={closeDetailsModal}
          >
            Close
          </button>
        </div>
      )}

      {/* TIMING EDIT MODAL (Right Panel) */}
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
            boxShadow: "-4px 0 10px rgba(0,0,0,0.3)",
            zIndex: 1100
          }}
        >
          <h4>Edit Office Timing</h4>
          <hr />

          <label>Office Start</label>
          <input
            type="time"
            className="form-control mb-2"
            value={timing.officeStart}
            onChange={(e) =>
              setTiming({ ...timing, officeStart: e.target.value })
            }
          />

          <label>Office End</label>
          <input
            type="time"
            className="form-control mb-2"
            value={timing.officeEnd}
            onChange={(e) =>
              setTiming({ ...timing, officeEnd: e.target.value })
            }
          />

          <label>Grace Minutes</label>
          <input
            type="number"
            className="form-control mb-2"
            value={timing.graceMinutes}
            onChange={(e) =>
              setTiming({ ...timing, graceMinutes: e.target.value })
            }
          />

          <label>Daily Working Hours</label>
          <input
            type="number"
            className="form-control mb-3"
            value={timing.dailyWorkingHours}
            onChange={(e) =>
              setTiming({ ...timing, dailyWorkingHours: e.target.value })
            }
          />

          <button className="btn btn-primary w-100 mb-2" onClick={saveTiming}>
            Save Timing
          </button>

          <button
            className="btn btn-secondary w-100"
            onClick={closeTimingModal}
          >
            Cancel
          </button>
        </div>
      )}

      {/* ADD HOLIDAY MODAL (CENTERED) */}
      {showHolidayModal && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.4)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1100
          }}
        >
          <div
            style={{
              width: "400px",
              maxWidth: "90%",
              background: "#fff",
              borderRadius: "10px",
              padding: "20px",
              boxShadow: "0 10px 25px rgba(0,0,0,0.25)"
            }}
          >
            <h4 className="mb-3">Add Holiday</h4>

            <label>Date</label>
            <input
              type="date"
              className="form-control mb-2"
              value={holidayDate}
              onChange={(e) => setHolidayDate(e.target.value)}
            />

            <label>Holiday Title</label>
            <input
              type="text"
              className="form-control mb-2"
              placeholder="Example: Diwali, Christmas"
              value={holidayTitle}
              onChange={(e) => setHolidayTitle(e.target.value)}
            />

            <label>Description (Optional)</label>
            <textarea
              className="form-control mb-3"
              rows="3"
              value={holidayDescription}
              onChange={(e) => setHolidayDescription(e.target.value)}
            />

            <button className="btn btn-success w-100" onClick={addHoliday}>
              Add Holiday
            </button>

            <button
              className="btn btn-secondary w-100 mt-2"
              onClick={() => setShowHolidayModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default Attendance;
