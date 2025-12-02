import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// ✅ Permission Check Helper
const canDo = (user, module, action) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.[action] === true;
};


const canViewPage = (user, module) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.view === true;
};

function Employee() {
  const [employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ✅ Fetch employees
  useEffect(() => {
    axios
      .get(`${API_URL}/api/getemployeeData`)
      .then((res) => {
        if (res.data) setEmployee(res.data);
        else alert("Something went wrong");
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  // ✅ Delete Handler
  const handleDelete = async (employeeId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/deleteSignUpUser/${employeeId}`);
      setEmployee(employee.filter((emp) => emp.employeeId !== employeeId));
      alert("Employee deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete employee");
    }
  };

  // ✅ PAGE ACCESS PERMISSION (must be AFTER hooks)
  if (!canViewPage(user, "employees")) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view Employees.</p>
      </div>
    );
  }

  // ✅ Export Employee List to Excel
  const exportToExcel = () => {
    const filteredData = employee
      .filter((emp) => {
        const q = search.toLowerCase();
        return (
          emp.employeeId?.toLowerCase().includes(q) ||
          emp.ename?.toLowerCase().includes(q) ||
          emp.phoneNo?.toLowerCase().includes(q) ||
          emp.official_email?.toLowerCase().includes(q) ||
          emp.department?.deptName?.toLowerCase().includes(q) ||
          emp.service?.serviceName?.toLowerCase().includes(q)
        );
      })
      .map((emp) => ({
        Employee_ID: emp.employeeId,
        Name: emp.ename,
        Phone: emp.phoneNo,
        Official_Email: emp.official_email,
        Last_Experience: emp.lastExp,
        Department: emp.department?.deptName || "",
        Service: emp.service?.serviceName || "",
      }));

    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Employees");

    XLSX.writeFile(workbook, "Employee_List.xlsx");
  };


  return (
    <div className="container-fluid py-4" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="card shadow-lg border-0 rounded-4">

        {/* Header */}
        <div
          className="card-header text-white text-center py-3 rounded-top-4"
          style={{ background: "linear-gradient(90deg, #1f3b98, #3f65d6)" }}
        >
          <h3 className="mb-0 fw-bold">👨‍💼 Employee List</h3>
        </div>

        <div className="card-body">
          {canDo(user, "employees", "add") && (
            <div className="d-flex mb-3">
              <Link to="/admin/addemployee" className="btn btn-primary rounded-pill fw-bold shadow-sm">
                ➕ Add Employee
              </Link>
            </div>
          )}
          <div className="d-flex justify-content-end mb-3 mt-4">
            <input
              type="text"
              style={{
                
                height: "38px",        // 🔥 Reduced height
                fontSize: "14px"
              }}
              className="form-control mb-3 shadow-sm"
              placeholder="🔍 Search by Name, ID, Phone, Email, Department, Service..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              style={{
                height: "45px",        // 🔥 Match height to search box
                padding: "0 20px",
                fontSize: "14px"
              }}
              className="btn btn-success shadow-sm mb-3 "
              onClick={exportToExcel}
            >
              ⬇️ Export Excel
            </button>
          </div>

          {/* ✅ Add Employee Button (permission-based) */}


          {/* Table */}
          <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <table className="table table-hover align-middle table-bordered text-center">
              <thead className="table-dark sticky-top" style={{ zIndex: "1" }}>
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Official Email</th>
                  <th>Last Exp</th>
                  <th>Department</th>
                  <th>Service</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {employee.filter((emp) => {
                  const q = search.toLowerCase();
                  return (
                    emp.employeeId?.toLowerCase().includes(q) ||
                    emp.ename?.toLowerCase().includes(q) ||
                    emp.phoneNo?.toLowerCase().includes(q) ||
                    emp.official_email?.toLowerCase().includes(q) ||
                    emp.department?.deptName?.toLowerCase().includes(q) ||
                    emp.service?.serviceName?.toLowerCase().includes(q)
                  );
                }).map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.ename}</td>
                    <td>{emp.phoneNo}</td>
                    <td style={{ maxWidth: "150px" }} className="text-truncate">
                      {emp.official_email}
                    </td>
                    <td>{emp.lastExp}</td>
                    <td>{emp.department?.deptName}</td>
                    <td>{emp.service?.serviceName}</td>

                    {/* ✅ Action Buttons with Permission Control */}
                    <td>
                      {/* View */}
                      {canDo(user, "employees", "view") && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => navigate(`/admin/ViewEmployee/${emp.employeeId}`)}
                        >
                          👁️ View
                        </button>
                      )}

                      {/* Update */}
                      {canDo(user, "employees", "edit") && (
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => navigate(`/admin/upDateUder/${emp.employeeId}`)}
                        >
                          ✏️ Update
                        </button>
                      )}

                      {/* Delete */}
                      {canDo(user, "employees", "delete") && (
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(emp.employeeId)}
                        >
                          🗑️ Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Employee;
