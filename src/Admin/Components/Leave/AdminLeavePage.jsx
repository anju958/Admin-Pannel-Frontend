import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

function AdminLeavePage() {
  const [leaves, setLeaves] = useState([]);
  const [loading, setLoading] = useState(true);

  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(new Date().getFullYear());

  // Modal States
  const [showModal, setShowModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [paid, setPaid] = useState(false);
  const [adminNote, setAdminNote] = useState("");

  const loadLeaves = () => {
    axios
      .get(`${API_URL}/api/admin/getAllLeave`)
      .then((res) => {
        setLeaves(res.data);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  /* ----------------------------------------
      UPDATE ADMIN LEAVE STATUS + PAID/UNPAID
  ---------------------------------------- */
  const updateLeave = async (id, status) => {
    try {
      await axios.put(`${API_URL}/api/admin/updateLeaveStatus/${id}`, {
        status,
        paid,
        adminNote,
      });

      alert(`Leave ${status} Successfully`);
      setShowModal(false);
      loadLeaves();
    } catch (err) {
      alert("Error updating leave");
    }
  };

  /* ----------------------------------------
      FILTER LEAVES BY MONTH / YEAR
  ---------------------------------------- */
  const filteredLeaves = leaves.filter((lv) => {
    const d = new Date(lv.from_date);
    return d.getMonth() === month && d.getFullYear() === year;
  });

  const getBadge = (status) => {
    if (status === "Approved") return "badge bg-success";
    if (status === "Rejected") return "badge bg-danger";
    return "badge bg-warning text-dark";
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-3">Admin Leave Panel</h3>

      {/* Month filter */}
      <div className="d-flex gap-2 mb-3">
        <select
          className="form-select w-auto"
          value={month}
          onChange={(e) => setMonth(Number(e.target.value))}
        >
          {[
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ].map((m, i) => (
            <option key={i} value={i}>{m}</option>
          ))}
        </select>

        <select
          className="form-select w-auto"
          value={year}
          onChange={(e) => setYear(Number(e.target.value))}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <option key={i} value={new Date().getFullYear() - i}>
              {new Date().getFullYear() - i}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave ID</th>
              <th>Type</th>
              <th>Category</th>
              <th>From</th>
              <th>To</th>
              <th>Days</th>
              <th>Employee Reason</th>
              <th>Admin Note</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan="12" className="text-center">Loading...</td>
              </tr>
            ) : filteredLeaves.length === 0 ? (
              <tr>
                <td colSpan="12" className="text-center">
                  No Leaves for this month
                </td>
              </tr>
            ) : (
              filteredLeaves.map((lv) => (
                <tr key={lv._id}>
                  <td>
                    <strong>{lv.employeeId?.ename}</strong><br />
                    <small>{lv.employeeId?.email}</small>
                  </td>

                  <td>{lv.leaveId}</td>
                  <td>{lv.leave_type}</td>
                  <td>{lv.leave_category}</td>

                  <td>{new Date(lv.from_date).toLocaleDateString()}</td>
                  <td>{new Date(lv.to_date).toLocaleDateString()}</td>

                  <td>{lv.days}</td>

                  {/* Employee Reason */}
                  <td>{lv.reason || "-"}</td>

                  {/* Admin Note */}
                  <td>
                    {lv.adminNote && lv.adminNote.trim() !== "" ? (
                      lv.adminNote
                    ) : (
                      <span className="text-muted">-</span>
                    )}
                  </td>

                  <td>
                    <span className={lv.paid ? "badge bg-success" : "badge bg-danger"}>
                      {lv.paid ? "Paid" : "Unpaid"}
                    </span>
                  </td>

                  <td>
                    <span className={getBadge(lv.status)}>
                      {lv.status}
                    </span>
                  </td>

                  <td>
                    {lv.status === "Pending" ? (
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => {
                          setSelectedLeave(lv);
                          setPaid(lv.paid);
                          setAdminNote(lv.adminNote || "");
                          setShowModal(true);
                        }}
                      >
                        Review
                      </button>
                    ) : (
                      <em>No Action</em>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && selectedLeave && (
        <div className="modal-overlay-custom">
          <div className="modal-box-custom">

            <h4>Review Leave Request</h4>
            <p>
              <strong>Employee:</strong> {selectedLeave.employeeId?.ename}<br />
              <strong>Leave ID:</strong> {selectedLeave.leaveId}<br />
              <strong>Days:</strong> {selectedLeave.days}<br />
            </p>

            {/* Paid Toggle */}
            <label className="form-label mt-2">Mark as Paid</label>
            <select
              className="form-select"
              value={paid}
              onChange={(e) => setPaid(e.target.value === "true")}
            >
              <option value="false">Unpaid</option>
              <option value="true">Paid</option>
            </select>

            {/* Admin Note */}
            <label className="form-label mt-3">Admin Note</label>
            <textarea
              className="form-control"
              rows="3"
              value={adminNote}
              onChange={(e) => setAdminNote(e.target.value)}
              placeholder="Write a note for employee..."
            ></textarea>

            <div className="d-flex justify-content-between mt-4">
              <button
                className="btn btn-success"
                onClick={() => updateLeave(selectedLeave._id, "Approved")}
              >
                Approve
              </button>

              <button
                className="btn btn-danger"
                onClick={() => updateLeave(selectedLeave._id, "Rejected")}
              >
                Reject
              </button>

              <button
                className="btn btn-secondary"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default AdminLeavePage;
