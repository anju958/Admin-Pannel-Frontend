import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

function SalaryPage() {
  const user = JSON.parse(localStorage.getItem("user"));

  const [salaryHistory, setSalaryHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (user?._id) fetchSalaryHistory();
  }, [user?._id, selectedYear]);

  const fetchSalaryHistory = async () => {
    setLoading(true);

    try {
      const res = await axios.get(
        `${API_URL}/api/salaryhistory/${user._id}?year=${selectedYear}`
      );

      let data = Array.isArray(res.data) ? res.data : [];

      // -----------------------------------------
      // REMOVE DUPLICATES → ONLY KEEP LATEST
      // -----------------------------------------
      const latestSalary = {};

      data.forEach((item) => {
        const key = `${item.month}-${item.year}`;

        if (!latestSalary[key]) {
          latestSalary[key] = item;
        } else {
          const old = new Date(latestSalary[key].createdAt);
          const newer = new Date(item.createdAt);

          if (newer > old) {
            latestSalary[key] = item;
          }
        }
      });

      // Convert back to array
      const uniqueList = Object.values(latestSalary);

      // Sort newest first
      uniqueList.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );

      setSalaryHistory(uniqueList);

    } catch (err) {
      console.error("Error fetching salary:", err);
      setSalaryHistory([]);
    }

    setLoading(false);
  };

  const currentMonth = new Date().toLocaleString("en-US", { month: "long" }).toLowerCase();

  const requestAccess = (month, year) => {
    alert(`Request sent to admin for ${month} ${year}`);
  };

  return (
    <div className="container-fluid">
      <div style={{ height: "30px" }}></div>

      {/* ---------- YEAR FILTER ON LEFT SIDE ---------- */}
      <div className="d-flex justify-content-start mb-3">
        <select
          className="form-select w-auto"
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
        >
          <option value={2023}>2023</option>
          <option value={2024}>2024</option>
          <option value={2025}>2025</option>
          <option value={2026}>2026</option>
        </select>
      </div>

      <h2 className="text-center mb-4">Salary Details ({selectedYear})</h2>

      <table className="table table-bordered table-striped shadow-sm">
        <thead className="table-light">
          <tr>
            <th>Month</th>
            <th>Year</th>
            <th>Basic Pay</th>
            <th>Deductions</th>
            <th>Net Salary</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {!loading && salaryHistory.length > 0 ? (
            salaryHistory.map((item, idx) => {
              const isCurrentMonth = item.month.toLowerCase() === currentMonth;

              return (
                <tr key={idx}>
                  <td>{item.month}</td>
                  <td>{item.year}</td>

                  <td className={!isCurrentMonth ? "blurred" : ""}>₹{item.basicPay}</td>

                  <td className={!isCurrentMonth ? "blurred" : ""}>
                    <div className="deduction-box">
                      <div className="deduction-total">Total: ₹{item.deductions}</div>
                      <div className="deduction-list">
                        <div><span>Absent:</span> ₹{item.deductionDetails.absent}</div>
                        <div><span>Half Day:</span> ₹{item.deductionDetails.halfDay}</div>
                        <div><span>Late:</span> ₹{item.deductionDetails.late}</div>
                        <div><span>Unpaid Leave:</span> ₹{item.deductionDetails.unpaidLeave}</div>
                      </div>
                    </div>
                  </td>

                  <td className={!isCurrentMonth ? "blurred" : ""}>₹{item.netPay}</td>

                  <td>
                    <span className={item.status === "Paid" ? "badge bg-success" : "badge bg-warning text-dark"}>
                      {item.status}
                    </span>
                  </td>

                  <td>
                    {!isCurrentMonth ? (
                      <button
                        className="btn btn-warning btn-sm"
                        onClick={() => requestAccess(item.month, item.year)}
                      >
                        Request Access
                      </button>
                    ) : (
                      <span className="text-success">Available</span>
                    )}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="7" className="text-center">
                {loading ? "Loading salary records..." : "No salary data found"}
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <style>
        {`
          .deduction-box {
            background: #f8f9fc;
            padding: 8px;
            border-radius: 6px;
            border: 1px solid #e4e6ef;
          }
          .deduction-total {
            font-weight: 700;
            margin-bottom: 8px;
          }
          .deduction-list div {
            display: flex;
            justify-content: space-between;
            padding: 2px 0;
            border-bottom: 1px dashed #ddd;
          }
          .deduction-list div:last-child {
            border-bottom: none;
          }
          .blurred {
            filter: blur(4px);
            opacity: 0.4;
          }
        `}
      </style>
    </div>
  );
}

export default SalaryPage;
