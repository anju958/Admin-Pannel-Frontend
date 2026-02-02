import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";
import axiosInstance from '../../../utils/axiosInstance'

// Permission helpers
const canDo = (user, module, action) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.[action] === true;
};

const canViewPage = (user, module) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.view === true;
};

function Trainee() {
  const [employee, setEmployee] = useState([]);
  const [search, setSearch] = useState("");   // ⭐ NEW
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/getTraineeData`)
      .then((res) => {
        if (res.data) setEmployee(res.data);
        else alert("Error fetching trainees");
      })
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  const handleDelete = async (employeeId) => {
    if (!canDo(user, "trainees", "delete"))
      return alert("You do not have permission to delete trainees.");

    const confirmDelete = window.confirm("Are you sure you want to delete this trainee?");
    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`${API_URL}/api/deleteSignUpUser/${employeeId}`);
      setEmployee((prev) => prev.filter((emp) => emp.employeeId !== employeeId));
      alert("Trainee deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete trainee");
    }
  };

  if (!canViewPage(user, "trainees")) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view Trainee & Intern List.</p>
      </div>
    );
  }

  // ⭐ LIVE FILTER (keyboard typing)
  const filtered = employee.filter((emp) => {
    const q = search.toLowerCase();

    return (
      emp.employeeId?.toLowerCase().includes(q) ||
      emp.ename?.toLowerCase().includes(q) ||
      emp.phoneNo?.toLowerCase().includes(q) ||
      emp.official_email?.toLowerCase().includes(q) ||
      emp.department?.deptName?.toLowerCase().includes(q) ||
      emp.service?.serviceName?.toLowerCase().includes(q)
    );
  });

  return (
    <div className="container-fluid py-4" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="card shadow-lg border-0 rounded-4">

        <div
          className="card-header text-white text-center py-3 rounded-top-4"
          style={{ background: "linear-gradient(90deg, #1f3b98, #3f65d6)" }}
        >
          <h3 className="mb-0 fw-bold">🎓 Trainee & Intern List</h3>
        </div>

        <div className="card-body">

          {/* Add trainee button */}
          {canDo(user, "trainees", "add") && (
            <div className="d-flex mb-3">
              <Link to="/admin/addemployee" className="btn btn-primary rounded-pill fw-bold shadow-sm">
                ➕ Add Trainee/Intern
              </Link>
            </div>
          )}

          {/* ⭐ SEARCH BAR */}
          <input
            type="text"
            className="form-control mb-3 shadow-sm"
            placeholder="🔍 Search by Name, ID, Phone, Email, Department, Service..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <table className="table table-hover align-middle table-bordered text-center">
              <thead className="table-dark sticky-top">
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Official Email</th>
                  <th>Last Exp</th>
                  <th>Department</th>
                  <th>Service</th>
                  <th>User Type</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {/* if no results */}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="9" className="text-center text-danger fw-bold py-3">
                      No matching trainee found 😕
                    </td>
                  </tr>
                )}

                {filtered.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.ename}</td>
                    <td>{emp.phoneNo}</td>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>
                      {emp.official_email}
                    </td>
                    <td>{emp.lastExp}</td>
                    <td>{emp.department?.deptName}</td>
                    <td>{emp.service?.serviceName}</td>

                    <td>
                      <span className={`badge ${emp.userType === "trainee" ? "bg-info text-dark" : "bg-secondary"}`}>
                        {emp.userType}
                      </span>
                    </td>

                    <td>
                      {canDo(user, "trainees", "view") && (
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() => navigate(`/admin/viewTrainee/${emp.employeeId}`)}
                        >
                          👁️ View
                        </button>
                      )}

                      {canDo(user, "trainees", "edit") && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => navigate(`/admin/upDateUder/${emp.employeeId}`)}
                        >
                          ✏️ Update
                        </button>
                      )}

                      {canDo(user, "trainees", "edit") && (
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() => navigate(`/admin/moveToEmplyee/${emp.employeeId}`)}
                        >
                          👤 Move
                        </button>
                      )}

                      {canDo(user, "trainees", "delete") && (
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

export default Trainee;
