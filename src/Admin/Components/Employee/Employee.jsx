
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../../../utils/dateFormatter";
import { API_URL } from "../../../config";

function Employee() {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

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

  useEffect(() => {
    axios.get(`${API_URL}/api/getemployeeData`)
      .then((res) => {
        if (res.data) setEmployee(res.data);
        else alert(res.data.Error);
      })
      .catch((err) => console.error("Error fetching employees:", err));
  }, []);

  console.log(employee)
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
          {/* Add Employee Button */}
          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/admin/addemployee"
              className="btn btn-primary rounded-pill fw-bold shadow-sm"
            >
              ➕ Add Employee
            </Link>
          </div>

          {/* Scrollable Table */}
          <div className="table-responsive" style={{ maxHeight: "70vh", overflowY: "auto" }}>
            <table className="table table-hover align-middle table-bordered text-center">
              <thead
                className="table-dark sticky-top"
                style={{ zIndex: "1" }}
              >
                <tr>
                  <th>Emp ID</th>
                  <th>Name</th>
                  <th>DOB</th>
                  <th>Gender</th>
                  <th>Phone</th>
                  <th>Personal Email</th>
                  <th>Official Email</th>
                  <th>Father</th>
                  <th>Mother</th>
                  <th>Address</th>
                  <th>Emergency Contact</th>
                  <th>Relation</th>
                  <th>Bank</th>
                  <th>Account No</th>
                  <th>IFSC</th>
                  <th>Holder</th>
                  <th>Aadhar</th>
                  <th>PAN</th>
                  <th>Qualification</th>
                  <th>Last Exp</th>
                  <th>Exp with PWT</th>
                  <th>Department</th>
                  <th>Service</th>
                  <th>Interview Date</th>
                  <th>Joining Date</th>
                  <th>Expected Salary</th>
                  <th>Given Salary</th>
                  <th>Working Time</th>
                  <th>Resume</th>
                  <th>Image</th>
                  <th>User Type</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {employee.map((emp) => (
                  <tr key={emp.employeeId}>
                    <td>{emp.employeeId}</td>
                    <td>{emp.ename}</td>
                    <td>{formatDate(emp.dateOfBirth)}</td>
                    <td>{emp.gender}</td>
                    <td>{emp.phoneNo}</td>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>
                      {emp.personal_email}
                    </td>
                    <td className="text-truncate" style={{ maxWidth: "150px" }}>
                      {emp.official_email}
                    </td>
                    <td>{emp.fatherName}</td>
                    <td>{emp.motherName}</td>
                    <td className="text-truncate" style={{ maxWidth: "180px" }}>
                      {emp.address}
                    </td>
                    <td>{emp.emergencyContact}</td>
                    <td>{emp.relation}</td>
                    <td>{emp.bankName}</td>
                    <td>{emp.accountNo}</td>
                    <td>{emp.ifscCode}</td>
                    <td>{emp.accountHolderName}</td>
                    <td>{emp.adarCardNo}</td>
                    <td>{emp.panNo}</td>
                    <td>{emp.qualification}</td>
                    <td>{emp.lastExp}</td>
                    <td>{emp.expWithPWT}</td>
                    <td>{emp.department?.deptName}</td>
                    <td>{emp.service?.serviceName}</td>
                    <td>{emp.interviewDate ? new Date(emp.interviewDate).toISOString().split("T")[0] : ""}</td>
                    <td>{emp.joiningDate ? new Date(emp.joiningDate).toISOString().split("T")[0] : ""}</td>
                    <td>{emp.expectedSalary}</td>
                    <td>{emp.givenSalary}</td>
                    <td>{emp.workingTime}</td>
                    <td>
                      {emp.resumeFile ? (
                        <a
                          href={emp.resumeFile}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-outline-primary btn-sm"
                        >
                          📄 Resume
                        </a>
                      ) : (
                        <span className="text-muted">No Resume</span>
                      )}
                    </td>
                    <td>
                      {emp.img ? (
                        <img
                          src={emp.img}
                          alt="Employee"
                          className="rounded-circle border shadow-sm"
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                        />
                      ) : (
                        <span className="text-muted">No Image</span>
                      )}
                    </td>
                    <td>{emp.userType}</td>
                    <td>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={() => navigate(`/admin/upDateUder/${emp.employeeId}`)}
                      >
                        ✏️ Update
                      </button>

                      <button
                        className="btn btn-danger btn-sm me-2"
                        onClick={() => handleDelete(emp.employeeId)}
                      >
                        🗑️ Delete
                      </button>
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
