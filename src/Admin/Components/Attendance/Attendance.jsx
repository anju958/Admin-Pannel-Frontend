import Button from "@mui/material/Button";
import React, { useState, useEffect } from "react";
import axios from "axios";

function Attendance() {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/get_attendance")
      .then((res) => {
        if (res.data) {
          setAttendance(res.data);
          console.log("Attendance Data:", res.data);
        } else {
          alert("No data found");
        }
      })
      .catch((err) => console.error("Error fetching attendance:", err));
  }, []);

  const filteredData = attendance.filter((row) => {
    const rowDate = new Date(row.date);
    if (selectedDate) {
      return rowDate.toISOString().slice(0, 10) === selectedDate;
    }
    if (selectedMonth) {
      const month = rowDate.toISOString().slice(0, 7);
      return month === selectedMonth;
    }
    return true;
  });

  return (
    <div className="container">
      <h2 className="mb-4 text-center">Employee Attendance</h2>

     
      <div className="mb-3 d-flex justify-content-end gap-2">
        <input
          type="search"
          className="form-control w-25"
          placeholder="Search by Emp ID or Name"
          onChange={(e) => setSelectedDate(e.target.value)}
        />
        <Button className="btn border btn-primary w-20">Search</Button>

        <input
          type="date"
          className="form-control w-25"
          value={selectedDate}
          onChange={(e) => {
            setSelectedDate(e.target.value);
            setSelectedMonth("");
          }}
        />
        <input
          type="month"
          className="form-control w-25"
          value={selectedMonth}
          onChange={(e) => {
            setSelectedMonth(e.target.value);
            setSelectedDate("");
          }}
        />
      </div>

   
      <div className="card shadow p-3">
        <table className="table table-hover table-bordered text-center align-middle">
          <thead className="table-dark">
            <tr>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Date</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Status</th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr key={index}>
                  <td>{row.empId?.employeeId}</td>
                  <td>{row.empId?.ename}</td>
                  <td>{new Date(row.date).toLocaleDateString()}</td>
                  <td>{row.check_in || "-"}</td>
                  <td>{row.check_out || "-"}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.status === "Present"
                          ? "bg-success"
                          : row.status === "Absent"
                          ? "bg-danger"
                          : "bg-warning"
                      }`}
                    >
                      {row.status}
                    </span>
                  </td>
                  <td>{row.remark || "-"}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-muted">
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Attendance;
