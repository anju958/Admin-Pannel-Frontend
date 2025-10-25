import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { formatDate } from "../../../utils/dateFormatter";
import { API_URL } from "../../../config";

function ViewTrainee() {
  const { employeeId } = useParams();
  const navigate = useNavigate();
  const [trainee, setTrainee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTraineeDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getTraineeData`);
        const emp = response.data.find((e) => e.employeeId === employeeId);
        
        if (emp) {
          setTrainee(emp);
        } else {
          alert("Trainee not found!");
          navigate("/admin/trainee");
        }
      } catch (error) {
        console.error("Error fetching trainee:", error);
        alert("Failed to fetch trainee details");
      } finally {
        setLoading(false);
      }
    };

    fetchTraineeDetails();
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

  if (!trainee) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger">Trainee not found!</div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4" style={{ background: "#f9faff", minHeight: "100vh" }}>
      {/* Header with Back Button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button 
          onClick={() => navigate("/admin/trainee")} 
          className="btn btn-outline-secondary rounded-pill"
        >
          ← Back to List
        </button>
        <div className="d-flex gap-2">
          <button
            onClick={() => navigate(`/admin/upDateUder/${trainee.employeeId}`)}
            className="btn btn-primary rounded-pill"
          >
            ✏️ Edit Trainee
          </button>
          <button
            onClick={() => navigate(`/admin/moveToEmplyee/${trainee.employeeId}`)}
            className="btn btn-success rounded-pill"
          >
            👤 Move to Employee
          </button>
        </div>
      </div>

      {/* Trainee Profile Card */}
      <div className="card shadow-lg border-0 rounded-4 mb-4">
        <div
          className="card-header text-white text-center py-4 rounded-top-4"
          style={{ background: "linear-gradient(90deg, #1f3b98, #3f65d6)" }}
        >
          <h3 className="mb-0 fw-bold">🎓 Trainee/Intern Profile</h3>
        </div>

        <div className="card-body p-4">
          {/* Profile Section */}
          <div className="row mb-4">
            <div className="col-md-3 text-center">
              {trainee.img ? (
                <img
                  src={trainee.img}
                  alt={trainee.ename}
                  className="rounded-circle border shadow"
                  style={{ width: "150px", height: "150px", objectFit: "cover" }}
                />
              ) : (
                <div 
                  className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center mx-auto shadow"
                  style={{ width: "150px", height: "150px", fontSize: "48px" }}
                >
                  {trainee.ename?.charAt(0).toUpperCase()}
                </div>
              )}
              <h4 className="mt-3 mb-1">{trainee.ename}</h4>
              <p className="text-muted">{trainee.employeeId}</p>
              <span className={`badge px-3 py-2 ${
                trainee.userType === "trainee" ? "bg-info text-dark" : "bg-secondary"
              }`}>
                {trainee.userType || "Trainee"}
              </span>
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
                      <p className="mb-0">{formatDate(trainee.dateOfBirth)}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Gender:</strong>
                      <p className="mb-0">{trainee.gender}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Phone:</strong>
                      <p className="mb-0">{trainee.phoneNo}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Personal Email:</strong>
                      <p className="mb-0">{trainee.personal_email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Official Email:</strong>
                      <p className="mb-0">{trainee.official_email}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Father's Name:</strong>
                      <p className="mb-0">{trainee.fatherName}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Mother's Name:</strong>
                      <p className="mb-0">{trainee.motherName}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Address:</strong>
                      <p className="mb-0">{trainee.address}</p>
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
                      <p className="mb-0">{trainee.emergencyContact}</p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="info-item">
                      <strong>Relationship:</strong>
                      <p className="mb-0">{trainee.relation}</p>
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
                  <p className="mb-0">{trainee.bankName || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Account Number:</strong>
                  <p className="mb-0">{trainee.accountNo || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>IFSC Code:</strong>
                  <p className="mb-0">{trainee.ifscCode || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Account Holder:</strong>
                  <p className="mb-0">{trainee.accountHolderName || "N/A"}</p>
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
                  <p className="mb-0">{trainee.adarCardNo || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-item">
                  <strong>PAN Number:</strong>
                  <p className="mb-0">{trainee.panNo || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="info-item">
                  <strong>Qualification:</strong>
                  <p className="mb-0">{trainee.qualification}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Training Details */}
          <div className="mb-4">
            <h5 className="text-primary mb-3 border-bottom pb-2">
              🎓 Training Details
            </h5>
            <div className="row g-3">
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Department:</strong>
                  <p className="mb-0">{trainee.department?.deptName || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Service:</strong>
                  <p className="mb-0">{trainee.service?.serviceName || "N/A"}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Last Experience:</strong>
                  <p className="mb-0">{trainee.lastExp}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Exp with PWT:</strong>
                  <p className="mb-0">{trainee.expWithPWT}</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Interview Date:</strong>
                  <p className="mb-0">
                    {trainee.interviewDate 
                      ? new Date(trainee.interviewDate).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Joining Date:</strong>
                  <p className="mb-0">
                    {trainee.joiningDate 
                      ? new Date(trainee.joiningDate).toLocaleDateString() 
                      : "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="info-item">
                  <strong>Working Time:</strong>
                  <p className="mb-0">{trainee.workingTime}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Stipend Information */}
          <div className="mb-4">
            <h5 className="text-primary mb-3 border-bottom pb-2">
              💰 Stipend/Salary Information
            </h5>
            <div className="row g-3">
              <div className="col-md-6">
                <div className="info-item">
                  <strong>Expected Salary:</strong>
                  <p className="mb-0 text-warning fs-5">
                    ₹{trainee.expectedSalary?.toLocaleString() || "N/A"}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="info-item">
                  <strong>Given Stipend/Salary:</strong>
                  <p className="mb-0 text-success fs-5">
                    ₹{trainee.givenSalary?.toLocaleString() || "N/A"}
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
                {trainee.resumeFile ? (
                  <a
                    href={trainee.resumeFile}
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

export default ViewTrainee;
