import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

function EmployeeAttendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toISOString().split("T")[0];

  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [previousAttendance, setPreviousAttendance] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);

  // Fetch today's attendance records
  const fetchAttendanceRecords = async () => {
    setLoadingRecords(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/employee/working-hours`,
        {
          params: {
            employeeId: user._id,
            date: today
          }
        }
      );
      setAttendanceRecords([response.data]);
    } catch (error) {
      console.error("Error fetching attendance:", error);
      setAttendanceRecords([]);
    } finally {
      setLoadingRecords(false);
    }
  };

  // Fetch previous attendance records (last 30 days)
  const fetchPreviousAttendance = async () => {
    setLoadingHistory(true);
    try {
      const response = await axios.get(
        `${API_URL}/api/attendance/history`,
        {
          params: {
            employeeId: user._id,
            limit: 30
          }
        }
      );
      setPreviousAttendance(response.data || []);
    } catch (error) {
      console.error("Error fetching attendance history:", error);
      setPreviousAttendance([]);
    } finally {
      setLoadingHistory(false);
    }
  };

  // Load attendance when component mounts
  useEffect(() => {
    if (user?._id) {
      fetchAttendanceRecords();
      fetchPreviousAttendance();
    }
  }, [user?._id]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (user?._id) {
        fetchAttendanceRecords();
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [user?._id]);

  return (
    <div className="container-fluid mt-4 mb-4">
      {/* Row 1: Today's Attendance */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card shadow-lg p-4 rounded-5 border-0" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
            <h2 className="text-center mb-4 fw-bold text-white">Today's Attendance</h2>

            {loadingRecords ? (
              <div className="text-center">
                <div className="spinner-border text-light" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : attendanceRecords.length > 0 ? (
              <div className="text-white">
                {attendanceRecords.map((record, idx) => (
                  <div key={idx} className="rounded-4 p-4" style={{ background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)" }}>
                    <div className="row mb-3">
                      <div className="col-md-4 text-center">
                        <small className="text-white-50">Date</small>
                        <p className="fw-bold fs-5">{new Date(record.date).toLocaleDateString('en-IN')}</p>
                      </div>
                      <div className="col-md-4 text-center">
                        <small className="text-white-50">Status</small>
                        <p className={`fw-bold fs-5 ${record.status === 'Present' ? 'text-success' : 'text-warning'}`}>
                          {record.status}
                        </p>
                      </div>
                      <div className="col-md-4 text-center">
                        <small className="text-white-50">Check-In</small>
                        <p className="fw-bold fs-5">{record.check_in || "N/A"}</p>
                      </div>
                    </div>

                    <hr style={{ borderColor: "rgba(255,255,255,0.2)" }} />

                    <div className="row">
                      <div className="col-md-6 text-center">
                        <small className="text-white-50">Check-Out</small>
                        <p className="fw-bold fs-5">{record.check_out || "Not Checked Out Yet"}</p>
                      </div>
                      <div className="col-md-6 text-center">
                        <small className="text-white-50">Working Hours</small>
                        <p className="fw-bold fs-5" style={{ color: "#FFD700" }}>{record.workingHours || "0"} hours</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="alert alert-light" role="alert">
                No attendance record for today
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Row 2: Previous Attendance History Table */}
      <div className="row">
        <div className="col-12">
          <div className="card shadow-lg p-4 rounded-5 border-0">
            <h2 className="mb-4 fw-bold text-primary">Attendance History (Last 30 Days)</h2>

            {loadingHistory ? (
              <div className="text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : previousAttendance.length > 0 ? (
              <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                  <thead style={{ background: "linear-gradient(90deg, #667eea 0%, #764ba2 100%)" }} className="text-white">
                    <tr>
                      <th className="text-center">Date</th>
                      <th className="text-center">Check-In</th>
                      <th className="text-center">Check-Out</th>
                      <th className="text-center">Status</th>
                      <th className="text-center">Working Hours</th>
                      <th className="text-center">Remarks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {previousAttendance.map((record, idx) => (
                      <tr key={idx} className={record.status === 'Present' ? '' : record.status === 'Absent' ? 'table-danger' : 'table-warning'}>
                        <td className="fw-bold text-center">{new Date(record.date).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</td>
                        <td className="text-center">{record.check_in || "-"}</td>
                        <td className="text-center">{record.check_out || "-"}</td>
                        <td className="text-center">
                          <span className={`badge fw-bold ${
                            record.status === 'Present' ? 'bg-success' : 
                            record.status === 'Absent' ? 'bg-danger' : 
                            record.status === 'Half Day' ? 'bg-warning text-dark' : 
                            'bg-info'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="fw-bold text-primary text-center">{record.workingHours || "0"} hrs</td>
                        <td className="text-center">{record.remark || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="alert alert-info" role="alert">
                No attendance history available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeAttendance;
