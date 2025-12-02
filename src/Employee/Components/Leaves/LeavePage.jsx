import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { API_URL } from "../../../config";

function LeavePage() {
  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || {};
    } catch {
      return {};
    }
  }, []);

  const [employee, setEmployee] = useState(null);
  const [leaveList, setLeaveList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const [leave, setLeave] = useState({
    leave_type: "",
    leave_category: "",
    from_date: "",
    to_date: "",
    reason: "",
  });

  /* ------------------------------------
      EXCEL EXPORT
  -------------------------------------- */
  const exportToExcel = () => {
    if (leaveList.length === 0) {
      alert("No data to export");
      return;
    }
    const worksheetData = leaveList.map((lv, index) => ({
      "S.No": index + 1,
      "Leave ID": lv.leaveId,
      "Employee Name": employee?.ename,
      "Leave Type": `${lv.leave_type} (${lv.leave_category})`,
      "From Date": new Date(lv.from_date).toDateString(),
      "To Date": new Date(lv.to_date).toDateString(),
      "Total Days": lv.days,
      "Paid / Unpaid": lv.paid ? "Paid" : "Unpaid",
      "Status": lv.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "LeaveReport.xlsx");
  };

  const exportSelectedMonth = () => {
    const filteredData = leaveList.filter((lv) => {
      const d = new Date(lv.from_date);
      return (
        d.getMonth() === selectedMonth &&
        d.getFullYear() === selectedYear
      );
    });

    if (filteredData.length === 0) {
      alert("No data to export for selected month");
      return;
    }

    const worksheetData = filteredData.map((lv, index) => ({
      "S.No": index + 1,
      "Leave ID": lv.leaveId,
      "Employee Name": employee?.ename,
      "Leave Type": `${lv.leave_type} (${lv.leave_category})`,
      "From Date": new Date(lv.from_date).toDateString(),
      "To Date": new Date(lv.to_date).toDateString(),
      "Total Days": lv.days,
      "Paid/Unpaid": lv.paid ? "Paid" : "Unpaid",
      "Status": lv.status,
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Selected Month Leaves");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, `LeaveReport_${selectedYear}_${selectedMonth + 1}.xlsx`);
  };
  /* ------------------------------------
      FETCH EMPLOYEE DETAILS
  -------------------------------------- */
  useEffect(() => {
    if (!user?.employeeId) return;

    axios
      .get(`${API_URL}/api/getEmpDataByID/${user.employeeId}`)
      .then((res) => setEmployee(res.data))
      .catch((err) => console.log(err));
  }, [user]);

  /* ------------------------------------
      FETCH LEAVES
  -------------------------------------- */
  useEffect(() => {
    if (!employee) return;

    axios
      .get(`${API_URL}/api/getAllLeaves/${employee.employeeId}`)
      .then((res) => {
        setLeaveList(res.data || []);
        setLoading(false);
      })
      .catch((err) => console.log(err));
  }, [employee]);

  /* ------------------------------------
      HANDLE INPUT CHANGE
  -------------------------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Half Day logic → from_date === to_date
    if (name === "leave_type") {
      if (value === "Half Day") {
        setLeave((prev) => ({
          ...prev,
          leave_type: value,
          to_date: prev.from_date,
        }));
      } else {
        setLeave((prev) => ({ ...prev, leave_type: value }));
      }
      return;
    }

    if (name === "from_date" && leave.leave_type === "Half Day") {
      setLeave((prev) => ({
        ...prev,
        from_date: value,
        to_date: value,
      }));
      return;
    }

    setLeave((prev) => ({ ...prev, [name]: value }));
  };





  const hasShortLeaveThisMonth = useMemo(() => {
    if (!leaveList.length) return false;

    const month = new Date().getMonth();
    const year = new Date().getFullYear();

    return leaveList.some((lv) => {
      const d = new Date(lv.from_date);
      return (
        lv.leave_category === "Short Leave" &&
        d.getMonth() === month &&
        d.getFullYear() === year
      );
    });
  }, [leaveList]);

  /* ------------------------------------
      SUBMIT LEAVE
  -------------------------------------- */
  const submitLeave = async (e) => {
    e.preventDefault();
    if (!employee) return;

    try {
      await axios.post(`${API_URL}/api/addLeave`, {
        employeeId: employee.employeeId,
        leave_type: leave.leave_type,
        leave_category: leave.leave_category,
        from_date: leave.from_date,
        to_date: leave.to_date,
        reason: leave.reason,
        status: "Pending",
      });

      alert("Leave applied successfully");
      setShowModal(false);

      // Refresh list
      const res = await axios.get(
        `${API_URL}/api/getAllLeaves/${employee.employeeId}`
      );
      setLeaveList(res.data);

      // Reset form
      setLeave({
        leave_type: "",
        leave_category: "",
        from_date: "",
        to_date: "",
        reason: "",
      });
    } catch (err) {
      console.log(err);
      alert(err.response?.data?.message || "Error applying leave");
    }
  };

  /* ------------------------------------
      STATUS COLORS
  -------------------------------------- */
  const getStatusDot = (status) => {
    if (status === "Approved") return "green-dot";
    if (status === "Rejected") return "red-dot";
    return "yellow-dot";
  };

  return (
    <div className="leave-container">

      {/* HEADER */}
      <div className="leave-header">
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          + New Leave
        </button>

        <button className="btn btn-outline-secondary ms-2" onClick={exportToExcel}>
          Export All
        </button>

        <button className="btn btn-outline-success ms-2" onClick={exportSelectedMonth}>
          Export Month
        </button>
      </div>
      {/* TABLE */}
      <div className="table-responsive leave-table-box">

        {/* MONTH / YEAR FILTER */}
        <div className="d-flex gap-2 mb-3">

          <select
            className="form-select w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {[
              "January", "February", "March", "April", "May", "June",
              "July", "August", "September", "October", "November", "December"
            ].map((month, index) => (
              <option value={index} key={index}>{month}</option>
            ))}
          </select>

          <select
            className="form-select w-auto"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {Array.from({ length: 5 }).map((_, i) => (
              <option key={i} value={new Date().getFullYear() - i}>
                {new Date().getFullYear() - i}
              </option>
            ))}
          </select>

        </div>

        {/* LEAVE TABLE */}
        <table className="table leave-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Leave ID</th>
              <th>Leave Date</th>
              <th>Duration</th>
              <th>Type</th>
              <th>Paid</th>
              <th>Status</th>
              <th>Reason</th>
              <th>Admin Note</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="text-center">Loading...</td>
              </tr>
            ) : leaveList.filter((lv) => {
              const d = new Date(lv.from_date);
              return (
                d.getMonth() === selectedMonth &&
                d.getFullYear() === selectedYear
              );
            }).length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center">No Leave Found For This Month</td>
              </tr>
            ) : (
              leaveList
                .filter((lv) => {
                  const d = new Date(lv.from_date);
                  return (
                    d.getMonth() === selectedMonth &&
                    d.getFullYear() === selectedYear
                  );
                })
                .map((lv, i) => (
                  <tr key={i}>
                    <td>
                      <div className="emp-box">
                        <img
                          src={employee?.img || "/user.png"}
                          className="emp-img"
                          alt=""
                        />
                        <div>
                          <strong>{employee?.ename}</strong>
                        </div>
                      </div>
                    </td>
                    <td>{lv.leaveId}</td>
                    <td>{new Date(lv.from_date).toLocaleDateString()}</td>
                    <td>{lv.leave_type}</td>
                    <td>{lv.leave_category}</td>
                    <td>
                      <span className={lv.paid ? "badge bg-success" : "badge bg-danger"}>
                        {lv.paid ? "Paid" : "Unpaid"}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusDot(lv.status)}></span>
                      {lv.status}
                    </td>

                    <td>{lv.reason}</td>
                    <td>
                      {lv.status === "Rejected"
                        ? lv.adminNote || "No reason given"
                        : lv.status === "Approved"
                          ? lv.adminNote || "-"
                          : "-"}
                    </td>
                  </tr>
                ))
            )}
          </tbody>
        </table>


      </div>


      {/* -----------------------------------
            MODAL
      -------------------------------------- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h4>Apply for Leave</h4>

            <form onSubmit={submitLeave}>

              {/* Full Day / Half Day */}
              <label>Leave Duration</label>
              <select
                name="leave_type"
                className="form-control mb-2"
                value={leave.leave_type}
                onChange={handleChange}
                required
              >
                <option value="">Select Duration</option>
                <option value="Full Day">Full Day</option>
                <option value="Half Day">Half Day</option>
              </select>

              {/* Category */}
              <label>Leave Category</label>
              <select
                name="leave_category"
                className="form-control mb-2"
                value={leave.leave_category}
                onChange={handleChange}
                required
              >
                <option value="">Select Category</option>

                {/* Short Leave Logic */}
                {!hasShortLeaveThisMonth ? (
                  <option value="Short Leave">Short Leave</option>
                ) : (
                  <option value="Short Leave" disabled>
                    Short Leave (Already Taken This Month)
                  </option>
                )}

                <option value="Sick Leave">Sick Leave</option>
                <option value="Casual Leave">Casual Leave</option>
              </select>


              {/* Dates */}
              <label>From Date</label>
              <input
                type="date"
                className="form-control mb-2"
                name="from_date"
                value={leave.from_date}
                onChange={handleChange}
                required
              />

              <label>To Date</label>
              <input
                type="date"
                className="form-control mb-2"
                name="to_date"
                value={leave.to_date}
                disabled={leave.leave_type === "Half Day"}
                onChange={handleChange}
                required
              />

              {leave.leave_type === "Half Day" && (
                <div className="alert alert-info p-2 mt-2">
                  Half Day Leave: From & To dates must be same.
                </div>
              )}

              {/* Reason */}
              <label>Reason</label>
              <input
                type="text"
                className="form-control mb-3"
                name="reason"
                value={leave.reason}
                onChange={handleChange}
                required
              />

              <button className="btn btn-primary w-100">Apply</button>

              <button
                type="button"
                className="btn btn-secondary w-100 mt-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default LeavePage;
