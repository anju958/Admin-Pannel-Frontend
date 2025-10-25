import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../../../utils/dateFormatter";
import { API_URL } from "../../../config";

function ViewEmployee() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeeDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getemployeeData`);
        const emp = response.data.find((e) => e.employeeId === employeeId);
        
        if (emp) {
          setEmployee(emp);
        } else {
          alert("Employee not found!");
          navigate("/admin/employee");
        }
      } catch (error) {
        console.error("Error fetching employee:", error);
        alert("Failed to fetch employee details");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeDetails();
  }, [employeeId, navigate]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!employee) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Employee not found!</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ background: "#f9faff", minHeight: "100vh" }}>
      {/* Header with Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          onClick={() => navigate("/admin/employee")} 
          className="btn btn-outline-secondary rounded-pill"
        >
          ← Back to List
        </button>
        <div className="d-flex gap-2">
          <button
            onClick={() => navigate(`/admin/upDateUder/${employee.employeeId}`)}
            className="btn btn-primary rounded-pill"
          >
            ✏️ Edit Employee
          </button>
        </div>
      </div>

      {/* Employee Profile Card */}
      <div className="card shadow-lg border-0 rounded-4 mb-4">
        <div
          className="card-header text-white text-center py-4 rounded-top-4"
          style={{ background: "linear-gradient(90deg, #1f3b98, #3f65d6)" }}
        >
          <h3 className="mb-0 fw-bold">👨‍💼 Employee Profile</h3>
        </div>

        <div className="card-body p-4">
          {/* Profile Section */}
          <div className="row mb-4">
            <div className="col-md-3 text-center">
              {employee.img ? (
                <img
                  src={employee.img}
                  alt={employee.ename}
                  className="rounded-circle border shadow"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center mx-auto shadow"
                  style={{ width: "150px", height: "150px", fontSize: "48px" }}
                >
                  {employee.ename?.charAt(0).toUpperCase()}
                </div>
              )}
              <h4 className="mt-3 mb-1">{employee.ename}</h4>
              <p className="text-muted">{employee.employeeId}</p>
              <span className="badge bg-success px-3 py-2">{employee.userType || "Employee"}</span>
            </div>

            <div className="col-md-9">
              {/* Personal Information */}
              <div className="mb-4">
                <h5 className="text-primary mb-3 border-bottom pb-2">
                  📋 Personal Information
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Date of Birth:</strong>
                      <p className="mb-0">{formatDate(employee.dateOfBirth)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Gender:</strong>
                      <p className="mb-0">{employee.gender}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Phone:</strong>
                      <p className="mb-0">{employee.phoneNo}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Personal Email:</strong>
                      <p className="mb-0">{employee.personal_email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Official Email:</strong>
                      <p className="mb-0">{employee.official_email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Father's Name:</strong>
                      <p className="mb-0">{employee.fatherName}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Mother's Name:</strong>
                      <p className="mb-0">{employee.motherName}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Address:</strong>
                      <p className="mb-0">{employee.address}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div className="mb-4">
                <h5 className="text-primary mb-3 border-bottom pb-2">
                  🚨 Emergency Contact
                </h5>
                <div className="row g-3">
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Contact Number:</strong>
                      <p className="mb-0">{employee.emergencyContact}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Relationship:</strong>
                      <p className="mb-0">{employee.relation}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          <div className="mb-4">
            <h5 className="text-primary mb-3 border-bottom pb-2">
              🏦 Bank Details
            </h5>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Bank Name:</strong>
                  <p className="mb-0">{employee.bankName}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Account Number:</strong>
                  <p className="mb-0">{employee.accountNo}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>IFSC Code:</strong>
                  <p className="mb-0">{employee.ifscCode}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Account Holder:</strong>
                  <p className="mb-0">{employee.accountHolderName}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Identity Documents */}
          <div className="mb-4">
            <h5 className="text-primary mb-3 border-bottom pb-2">
              🆔 Identity Documents
            </h5>
            <div className="row g-3">
              <div className="col-md-4">
                <div className="info-item">
                  <strong>Aadhar Card:</strong>
                  <p className="mb-0">{employee.adarCardNo}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-item">
                  <strong>PAN Number:</strong>
                  <p className="mb-0">{employee.panNo}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-item">
                  <strong>Qualification:</strong>
                  <p className="mb-0">{employee.qualification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details */}
          <div className="mb-4">
            <h5 className="text-primary mb-3 border-bottom pb-2">
              💼 Professional Details
            </h5>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Department:</strong>
                  <p className="mb-0">{employee.department?.deptName || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Service:</strong>
                  <p className="mb-0">{employee.service?.serviceName || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Last Experience:</strong>
                  <p className="mb-0">{employee.lastExp}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Exp with PWT:</strong>
                  <p className="mb-0">{employee.expWithPWT}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Interview Date:</strong>
                  <p className="mb-0">
                    {employee.interviewDate 
                      ? new Date(employee.interviewDate).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Joining Date:</strong>
                  <p className="mb-0">
                    {employee.joiningDate 
                      ? new Date(employee.joiningDate).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Working Time:</strong>
                  <p className="mb-0">{employee.workingTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Salary Information */}
          <div className="mb-4">
            <h5 className="text-primary mb-3 border-bottom pb-2">
              💰 Salary Information
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="info-item">
                  <strong>Expected Salary:</strong>
                  <p className="mb-0 text-success fs-5">
                    ₹{employee.expectedSalary?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item">
                  <strong>Given Salary:</strong>
                  <p className="mb-0 text-primary fs-5">
                    ₹{employee.givenSalary?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents */}
          <div className="mb-4">
            <h5 className="text-primary mb-3 border-bottom pb-2">
              📄 Documents
            </h5>
            <div className="row g-3">
              <div className="col-md-12">
                {employee.resumeFile ? (
                  <a
                    href={employee.resumeFile}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline-primary"
                  >
                    📄 Download Resume
                  </a>
                ) : (
                  <span className="text-muted">No Resume Available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ViewEmployee;
