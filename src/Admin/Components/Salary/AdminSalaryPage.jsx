
import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

function AdminSalaryPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [month, setMonth] = useState("November");
    const [year, setYear] = useState(new Date().getFullYear());
    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selected, setSelected] = useState(null);

    useEffect(() => {
        fetchRows();
    }, [month, year]);

    // ===================== FETCH MAIN TABLE ======================
    const fetchRows = async () => {
        setLoading(true);
        try {
            const res = await axios.get(
                `${API_URL}/api/salary/all?month=${month}&year=${year}`
            );
            setRows(res.data || []);
        } catch (err) {
            console.error("fetchRows:", err);
            setRows([]);
        }
        setLoading(false);
    };

    // ===================== GENERATE SALARY ======================
    const generateForEmployee = async (empDbId) => {
        if (!window.confirm("Generate salary for this employee?")) return;

        try {
            await axios.post(`${API_URL}/api/generateSalary/${empDbId}`, {
                month,
                year,
            });
            fetchRows();
        } catch (err) {
            console.error("generateForEmployee:", err);
            alert("Error generating salary");
        }
    };

    // ===================== RE-GENERATE SALARY ======================
    const regenSalary = async (empId) => {
        if (!window.confirm("Re-generate salary?")) return;

        try {
            await axios.post(`${API_URL}/api/regenSalary/${empId}`, {
                month,
                year,
            });
            fetchRows();
        } catch (err) {
            console.log("regenSalary:", err);
            alert("Error re-generating salary");
        }
    };

    // ===================== MARK AS PAID ======================
    const markPaid = async (salaryId) => {
        if (!window.confirm("Mark this salary as Paid?")) return;

        try {
            await axios.put(`${API_URL}/api/salary/update/${salaryId}`, {
                status: "Paid",
            });
            fetchRows();
        } catch (err) {
            console.error("markPaid:", err);
            alert("Error updating salary status");
        }
    };

    // ===================== GET SALARY HISTORY ======================
    const getSalaryHistory = async (empId) => {
        try {
            const res = await axios.get(`${API_URL}/api/salaryhistory/${empId}`);
            console.log("History:", res.data);
            alert("Check console for salary history data");
        } catch (err) {
            console.log("getSalaryHistory:", err);
        }
    };

    // ===================== REQUEST ACCESS ======================
    const requestAccess = async () => {
        try {
            await axios.post(`${API_URL}/api/salary/requestAccess`);
            alert("Access request submitted");
        } catch (err) {
            console.log("requestAccess:", err);
        }
    };

    // ===================== APPROVE ACCESS ======================
    const approveAccess = async (requestId) => {
        try {
            await axios.put(`${API_URL}/api/salary/approveAccess/${requestId}`);
            alert("Access Approved");
        } catch (err) {
            console.log("approveAccess:", err);
        }
    };

    // ===================== EMPLOYEE WISE SALARY ======================
    const getEmployeeWise = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/salary/employee-wise`);
            console.log(res.data);
        } catch (err) {
            console.log(err);
        }
    };

    // ===================== ADMIN ALL SALARIES ======================
    const adminGetAllSalary = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/salary/all/getsalary`);
            console.log("Admin All Salary:", res.data);
        } catch (err) {
            console.log(err);
        }
    };


    // ===================== OPEN DETAILS MODAL ======================
    const openDetails = (row) => {
        setSelected(row);
        setShowModal(true);
    };

    // ===================== SEARCH FILTER ======================
    const filtered = rows.filter(r => {


        const name = (r.employeeId?.ename || r.employeeName || "").toLowerCase();
        const empCode = (r.employeeId?.empCode || "").toLowerCase();
        const q = search.toLowerCase();
        return name.includes(q) || empCode.includes(q);

    });
    console.log("ROWS:", filtered);
    return (
        <div className="container-fluid">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>All Employee Salaries</h2>

                <div className="d-flex gap-2">
                    <select value={month} onChange={e => setMonth(e.target.value)} className="form-select">
                        {["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
                            .map(m => <option key={m}>{m}</option>)}
                    </select>

                    <select value={year} onChange={e => setYear(Number(e.target.value))} className="form-select">
                        {[2023, 2024, 2025, 2026].map(y => <option key={y}>{y}</option>)}
                    </select>

                    <button className="btn btn-success">Export Excel</button>
                </div>
            </div>

            <input className="form-control mb-3" placeholder="Search employee..."
                value={search} onChange={e => setSearch(e.target.value)} />

            {/* ===================== TABLE ======================= */}
            <table className="table table-bordered">
                <thead className="table-light">
                    <tr>
                        <th>Employee</th>
                        <th>Month</th>
                        <th>Basic Pay</th>
                        <th>Attendance</th>
                        <th>Net Salary</th>
                        <th>Status</th>
                        <th>Action</th>
                    </tr>
                </thead>

                <tbody>
                    {!loading && filtered.length === 0 && (
                        <tr><td colSpan="7" className="text-center">No records</td></tr>
                    )}

                    {loading && (
                        <tr><td colSpan="7" className="text-center">Loading...</td></tr>
                    )}

                    {!loading && filtered.map((r, idx) => (

                        <tr key={idx}>
                            <td>
                                <strong>{r.employeeName || "N/A"}</strong><br />
                                <small className="text-muted">{r.empCode}</small>
                            </td>

                            <td>{r.month} {r.year}</td>
                            <td>₹{r.basicPay || r.employeeId?.givenSalary}</td>

                            <td>
                                P:{r.totalPresent} |
                                A:{r.totalAbsent} |
                                HD:{r.totalHalfDays} |
                                PL:{r.paidLeaves} |
                                UPL:{r.unpaidLeaves}
                            </td>

                            <td>₹{r.netPay}</td>

                            <td>
                                {r.status === "Paid" && <span className="badge bg-success">Paid</span>}
                                {r.status === "Pending" && <span className="badge bg-warning text-dark">Pending</span>}
                                {r.status === "Not Generated" && <span className="badge bg-danger">Not Generated</span>}
                            </td>

                            <td>
                                {r.status === "Not Generated" && (
                                    <button className="btn btn-warning btn-sm"
                                        onClick={() => generateForEmployee(r.empDbId)}>
                                        Generate Salary
                                    </button>
                                )}

                                {r.status !== "Not Generated" && (
                                    <>
                                        <button className="btn btn-primary btn-sm me-2"
                                            onClick={() => openDetails(r)}>
                                            View Details
                                        </button>

                                        {r.status !== "Paid" && (
                                            <button className="btn btn-success btn-sm me-2"
                                                onClick={() => markPaid(r._id)}>
                                                Mark Paid
                                            </button>
                                        )}

                                        <button className="btn btn-danger btn-sm"
                                            onClick={() => regenSalary(r.empDbId)}>
                                            Re-Generate
                                        </button>
                                    </>
                                )}
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            {/* ===================== MODAL ======================= */}
            {showModal && selected && (
                <div style={{ display: "block", background: "rgba(0,0,0,0.5)" }} className="modal fade show">
                    <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5>Salary Details — {selected.employeeId?.ename}</h5>
                                <button className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>

                            <div className="modal-body">
                                <p><strong>ID:</strong> {selected.employeeId?.empCode}</p>
                                <p><strong>Month:</strong> {selected.month} {selected.year}</p>

                                <h6>Attendance</h6>
                                <p>
                                    P:{selected.totalPresent} |
                                    A:{selected.totalAbsent} |
                                    HD:{selected.totalHalfDays} |
                                    PL:{selected.paidLeaves} |
                                    UPL:{selected.unpaidLeaves}
                                </p>

                                <h6>Salary Breakdown</h6>
                                <table className="table table-sm">
                                    <tbody>
                                        <tr><th>Basic</th><td>₹{selected.basicPay}</td></tr>
                                        <tr><th>Deductions</th><td>₹{selected.deductions}</td></tr>
                                        <tr className="table-success"><th>Net</th><td>₹{selected.netPay}</td></tr>
                                        <tr><th>Status</th><td>{selected.status}</td></tr>
                                    </tbody>
                                </table>
                            </div>

                            <div className="modal-footer">
                                <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminSalaryPage;
