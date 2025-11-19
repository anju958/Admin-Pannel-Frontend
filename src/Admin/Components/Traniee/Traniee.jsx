import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// ✅ Permission helpers
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
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // ✅ Get logged-in user

  // ✅ Fetch trainees/interns
  useEffect(() => {
    axios
      .get(`${API_URL}/api/getTraineeData`)
      .then((res) => {
        if (res.data) setEmployee(res.data);
        else alert("Error fetching trainees");
      })
      .catch((err) => console.error("Fetch Error:", err));
  }, []);

  // ✅ Delete handler
  const handleDelete = async (employeeId) => {
    if (!canDo(user, "trainees", "delete"))
      return alert("You do not have permission to delete trainees.");

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this trainee?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/deleteSignUpUser/${employeeId}`);
      setEmployee((prev) =>
        prev.filter((emp) => emp.employeeId !== employeeId)
      );
      alert("Trainee deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete trainee");
    }
  };

  // ✅ PAGE ACCESS PERMISSION (after hooks)
  if (!canViewPage(user, "trainees")) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view Trainee & Intern List.</p>
      </div>
    );
  }

  return (
    <div
      className="container-fluid py-4"
      style={{ background: "#f9faff", minHeight: "100vh" }}
    >
      <div className="card shadow-lg border-0 rounded-4">
        {/* Header */}
        <div
          className="card-header text-white text-center py-3 rounded-top-4"
          style={{ background: "linear-gradient(90deg, #1f3b98, #3f65d6)" }}
        >
          <h3 className="mb-0 fw-bold">🎓 Trainee & Intern List</h3>
        </div>

        <div className="card-body">
          {/* ✅ Add Trainee (permission based) */}
          {canDo(user, "trainees", "add") && (
            <div className="d-flex mb-3">
              <Link
                to="/admin/addemployee"
                className="btn btn-primary rounded-pill fw-bold shadow-sm"
              >
                ➕ Add Trainee/Intern
              </Link>
            </div>
          )}

          {/* Table */}
          <div
            className="table-responsive"
            style={{ maxHeight: "70vh", overflowY: "auto" }}
          >
            <table className="table table-hover align-middle table-bordered text-center">
              <thead className="table-dark sticky-top" style={{ zIndex: 1 }}>
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
                {employee.map((emp) => (
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
                      <span
                        className={`badge ${
                          emp.userType === "trainee"
                            ? "bg-info text-dark"
                            : "bg-secondary"
                        }`}
                      >
                        {emp.userType}
                      </span>
                    </td>

                    {/* ✅ ACTION BUTTONS WITH PERMISSION CONTROL */}
                    <td>
                      {/* View */}
                      {canDo(user, "trainees", "view") && (
                        <button
                          className="btn btn-info btn-sm me-2"
                          onClick={() =>
                            navigate(`/admin/viewTrainee/${emp.employeeId}`)
                          }
                        >
                          👁️ View
                        </button>
                      )}

                      {/* Update */}
                      {canDo(user, "trainees", "edit") && (
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() =>
                            navigate(`/admin/upDateUder/${emp.employeeId}`)
                          }
                        >
                          ✏️ Update
                        </button>
                      )}

                      {/* Move to Employee */}
                      {canDo(user, "trainees", "edit") && (
                        <button
                          className="btn btn-primary btn-sm me-2"
                          onClick={() =>
                            navigate(`/admin/moveToEmplyee/${emp.employeeId}`)
                          }
                        >
                          👤 Move
                        </button>
                      )}

                      {/* Delete */}
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
