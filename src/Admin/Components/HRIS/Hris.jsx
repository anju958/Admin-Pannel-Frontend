import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { Spinner, Button, Modal } from "react-bootstrap";

export default function HRIS() {
  const [rows, setRows] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [userTypeFilter, setUserTypeFilter] = useState("all");

  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [busyDelete, setBusyDelete] = useState(false);

  // List of columns to render based on your schema
  const columns = useMemo(() => ([
    { key: "img", label: "Photo" },
    { key: "employeeId", label: "Employee ID" },
    { key: "ename", label: "Name" },
    { key: "dateOfBirth", label: "DOB" },
    { key: "gender", label: "Gender" },
    { key: "phoneNo", label: "Phone" },
    { key: "personal_email", label: "Personal Email" },
    { key: "official_email", label: "Official Email" },
    { key: "fatherName", label: "Father" },
    { key: "motherName", label: "Mother" },
    { key: "address", label: "Address" },
    { key: "emergencyContact", label: "Emergency Contact" },
    { key: "relation", label: "Relation" },
    { key: "bankName", label: "Bank Name" },
    { key: "accountNo", label: "Account No" },
    { key: "ifscCode", label: "IFSC" },
    { key: "accountHolderName", label: "Account Holder" },
    { key: "adarCardNo", label: "Aadhar" },
    { key: "panNo", label: "PAN" },
    { key: "qualification", label: "Qualification" },
    { key: "lastExp", label: "Last Exp" },
    { key: "expWithPWT", label: "Exp With PWT" },
    { key: "department", label: "Department" },
    { key: "service", label: "Service" },
    { key: "interviewDate", label: "Interview Date" },
    { key: "joiningDate", label: "Joining Date" },
    { key: "expectedSalary", label: "Expected Salary" },
    { key: "givenSalary", label: "Given Salary" },
    { key: "workingTime", label: "Working Time" },
    { key: "resumeFile", label: "Resume" },
    { key: "userType", label: "User Type" },
    { key: "traineeDuration", label: "Trainee Duration" },
    { key: "isActive", label: "Active" },
    { key: "createdAt", label: "Created At" },
    // Delete button will be rendered separately as last column
  ]), []);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/getAllEmployees`);
        // Expect res.data to be an array
        const list = Array.isArray(res.data) ? res.data : (res.data?.employees ?? []);
        setRows(list);
        setFiltered(list);
      } catch (err) {
        console.error("HRIS fetch error:", err.response?.data ?? err.message ?? err);
        setRows([]);
        setFiltered([]);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Filtering + searching
  useEffect(() => {
    let temp = [...rows];

    // user type filter
    if (userTypeFilter && userTypeFilter !== "all") {
      temp = temp.filter((r) => (r.userType || "").toLowerCase() === userTypeFilter.toLowerCase());
    }

    // search filter
    if (search && search.trim() !== "") {
      const s = search.toLowerCase();
      temp = temp.filter((r) => {
        return (
          (r.ename || "").toLowerCase().includes(s) ||
          (r.personal_email || "").toLowerCase().includes(s) ||
          (r.employeeId || "").toLowerCase().includes(s) ||
          (r.phoneNo || "").toLowerCase().includes(s)
        );
      });
    }

    setFiltered(temp);
  }, [rows, search, userTypeFilter]);

  // helpers to format values
  const fmtDate = (v) => {
    if (!v) return "N/A";
    const d = new Date(v);
    if (isNaN(d.getTime())) return String(v);
    return d.toLocaleDateString();
  };

  const openDelete = (row) => {
    setToDelete(row);
    setDeleteModalOpen(true);
  };

  const closeDelete = () => {
    setToDelete(null);
    setDeleteModalOpen(false);
  };

  // Delete handler: tries DELETE by _id, if fails attempts employeeId
  const handleDelete = async () => {
    if (!toDelete) return;
    setBusyDelete(true);
    try {
      // Try by _id first
      const tryId = toDelete._id || toDelete.employeeId;
      try {
        await axios.delete(`${API_URL}/api/deleteEmp/${tryId}`);
      } catch (err) {
        // fallback: try by employeeId if different
        if (toDelete.employeeId && toDelete.employeeId !== tryId) {
          await axios.delete(`${API_URL}/api/deleteEmp/${toDelete.employeeId}`);
        } else {
          // rethrow
          throw err;
        }
      }

      // remove from UI
      setRows((prev) => prev.filter((r) => (r._id !== toDelete._id && r.employeeId !== toDelete.employeeId)));
      setFiltered((prev) => prev.filter((r) => (r._id !== toDelete._id && r.employeeId !== toDelete.employeeId)));
      closeDelete();
    } catch (err) {
      console.error("Delete error:", err.response?.data ?? err.message ?? err);
      alert("Failed to delete user. See console.");
    } finally {
      setBusyDelete(false);
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" />
      </div>
    );
  }

  return (
    <div className="container-fluid py-3">
      <h3 className="mb-3">HRIS — Employee & Trainee Master</h3>

      <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
        <input
          className="form-control"
          placeholder="Search name, email, phone, employeeId..."
          style={{ maxWidth: 420 }}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select className="form-select" style={{ maxWidth: 200 }} value={userTypeFilter} onChange={(e) => setUserTypeFilter(e.target.value)}>
          <option value="all">All Types</option>
          <option value="employee">Employee</option>
          <option value="trainee">Trainee</option>
          <option value="intern">Intern</option>
        </select>

        <div className="ms-auto">
          <strong>Total: </strong> {filtered.length}
        </div>
      </div>

      <div style={{ width: "100%", overflow: "auto", border: "1px solid #eaeaea", borderRadius: 6 }}>
        <table className="table table-sm table-bordered mb-0" style={{ minWidth: 2200 }}>
          <thead className="table-secondary" style={{ position: "sticky", top: 0, zIndex: 2 }}>
            <tr>
              {columns.map((c) => (
                <th key={c.key} style={{ whiteSpace: "nowrap", minWidth: 120 }}>{c.label}</th>
              ))}
              <th style={{ minWidth: 120 }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={columns.length + 1} className="text-center p-4">No records found</td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r._id || r.employeeId}>
                  {columns.map((c) => {
                    const key = c.key;
                    let val = r[key];

                    // special renderers:
                    if (key === "img") {
                      return (
                        <td key={key} style={{ width: 80, textAlign: "center" }}>
                          <img
                            src={r.img || "/default-avatar.png"}
                            alt="p"
                            style={{ width: 48, height: 48, objectFit: "cover", borderRadius: "50%" }}
                          />
                        </td>
                      );
                    }

                    if (key === "department") {
                      val = r.department?.deptName ?? "N/A";
                    }
                    if (key === "service") {
                      val = r.service?.serviceName ?? "N/A";
                    }
                    if (key === "resumeFile") {
                      return (
                        <td key={key} style={{ whiteSpace: "nowrap" }}>
                          {r.resumeFile ? (
                            <a href={r.resumeFile} target="_blank" rel="noreferrer" className="btn btn-outline-primary btn-sm">View</a>
                          ) : "N/A"}
                        </td>
                      );
                    }
                    if (key === "isActive") {
                      return (
                        <td key={key}>
                          <span className={`badge ${r.isActive ? "bg-success" : "bg-danger"}`}>
                            {r.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                      );
                    }
                    if (key.toLowerCase().includes("date")) {
                      return (<td key={key}>{fmtDate(val)}</td>);
                    }

                    // default primitive
                    return <td key={key} style={{ whiteSpace: "nowrap" }}>{val ?? "N/A"}</td>;
                  })}

                  <td style={{ whiteSpace: "nowrap" }}>
                    <Button size="sm" variant="danger" onClick={() => openDelete(r)} className="me-2">Delete</Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal show={deleteModalOpen} onHide={closeDelete} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete <strong>{toDelete?.ename || toDelete?.employeeId}</strong>?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeDelete} disabled={busyDelete}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={busyDelete}>
            {busyDelete ? "Deleting..." : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
