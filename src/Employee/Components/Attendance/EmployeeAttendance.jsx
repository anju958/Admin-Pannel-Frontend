
import React, { useState, useEffect } from "react";
import axios from "axios";

function EmployeeAttendance() {
  const user = JSON.parse(localStorage.getItem("user"));
  const today = new Date().toISOString().split("T")[0];

  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: "",
    employeeName: "",
    date: today,
    check_in: "09:00",
    check_out: "18:00",
    status: "",
    remark: ""
  });

  useEffect(() => {
    if (user?.employeeId) {
      axios
        .get(`http://localhost:5000/api/getEmpDataByID/${user.employeeId}`)
        .then((res) => {
          const currentEmployee = res.data;
          if (currentEmployee) {
            setEmployee(currentEmployee);
            setFormData((prev) => ({
              ...prev,
              employeeId: currentEmployee.employeeId || "",
              employeeName: currentEmployee.ename || "",
            }));
          }
        })
        .catch((err) => console.error("Error fetching employee:", err));
    }
  }, [user]);

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await axios.post("http://localhost:5000/api/add_attendance", formData);
      setMessage(res.data.message || "Attendance marked successfully!");
      setIsError(false);

      setFormData({
        employeeId: employee?.employeeId || "",
        employeeName: employee?.ename || "",
        date: today,
        check_in: "09:00",
        check_out: "18:00",
        status: "",
        remark: ""
      });
    } catch (error) {
      console.error(error);
      setMessage(error.response?.data?.message || "Error submitting attendance");
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow p-4">
        <h2 className="text-center mb-4">Attendance Form</h2>

     
        {message && (
          <div className={`alert ${isError ? "alert-danger" : "alert-success"}`} role="alert">
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
        
          <div className="mb-3">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              className="form-control"
              name="employeeId"
              value={formData.employeeId}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              className="form-control"
              name="employeeName"
              value={formData.employeeName}
              disabled
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Date</label>
            <input
              type="date"
              className="form-control"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
          </div>

          
          <div className="mb-3">
            <label className="form-label">Check-In Time</label>
            <input
              type="time"
              className="form-control"
              name="check_in"
              value={formData.check_in}
              onChange={handleChange}
              required={formData.status === "Present" || formData.status === "Half Day"}
              disabled={formData.status === "Absent" || formData.status === "Leave"}
            />
          </div>

        
          <div className="mb-3">
            <label className="form-label">Check-Out Time</label>
            <input
              type="time"
              className="form-control"
              name="check_out"
              value={formData.check_out}
              onChange={handleChange}
              required={formData.status === "Present" || formData.status === "Half Day"}
              disabled={formData.status === "Absent" || formData.status === "Leave"}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              className="form-select"
              name="status"
              value={formData.status}
              onChange={handleChange}
              required
            >
              <option value="">-- Select Status --</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Half Day">Half Day</option>
              <option value="Leave">Leave</option>
            </select>
          </div>

        
          <div className="mb-3">
            <label className="form-label">Remarks</label>
            <textarea
              className="form-control"
              rows="3"
              name="remarks"
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Any notes..."
            />
          </div>

          
          <button
            type="submit"
            className="btn btn-primary w-100 rounded-pill"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Mark Attendance"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmployeeAttendance;
