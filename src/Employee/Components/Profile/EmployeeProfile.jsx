import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { Button, Spinner } from "react-bootstrap";

function EmployeeProfile() {
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [imgPreview, setImgPreview] = useState(null);

  const user = JSON.parse(localStorage.getItem("user")) || {};

  // Flatten objects such as department/service
  const flattenData = (data = {}) => {
    return {
      ...data,
      department: data?.department?._id ?? data.department ?? "",
      service: data?.service?._id ?? data.service ?? "",
    };
  };

  // Date formatter for <input type="date">
  const formatDateInput = (value) => {
    if (!value) return "";
    const d = new Date(value);
    if (isNaN(d.getTime())) return "";
    return d.toISOString().split("T")[0];
  };

  // Load employee by employeeId (NOT MongoId)
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!user?.employeeId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_URL}/api/getEmpdatabyID/${user.employeeId}`);
        const emp = res.data;

        setEmployee(emp);
        setImgPreview(emp.img || null);
      } catch (err) {
        console.error("Error fetching employee:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, []);

  // When Edit mode is enabled → copy employee → formData
  useEffect(() => {
    if (editMode && employee) {
      setFormData(flattenData(employee));
    }
  }, [editMode, employee]);

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );

  if (!employee)
    return <div className="text-center mt-5">No employee data found.</div>;

  // Input change handler
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  // File change handler
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const name = e.target.name;
    setFormData((prev) => ({ ...prev, [name]: file }));
    if (name === "img") setImgPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    try {
      const cleaned = flattenData(formData);
      const data = new FormData();

      // Allow empty strings to override data
      Object.entries(cleaned).forEach(([key, val]) => {
        if (val instanceof File) {
          data.append(key, val);
        } else {
          data.append(key, val ?? "");
        }
      });

      // Use Mongo _id for update
      const idToUpdate = employee._id;

      const res = await axios.put(
        `${API_URL}/api/updateSelfId/${idToUpdate}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      const updated = res.data?.employee ?? res.data;

      setEmployee(updated);
      setFormData(flattenData(updated));
      setImgPreview(updated.img || null);
      setEditMode(false);

      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating:", err.response?.data || err.message);
      alert("Update failed. Check console.");
    }
  };

  const renderValue = (key) => {
    const val = employee[key];
    if (!val) return "N/A";
    if (key.toLowerCase().includes("date"))
      return new Date(val).toLocaleDateString();
    return val;
  };

  const renderEditInput = (key, label) => {
    if (key.toLowerCase().includes("date")) {
      return (
        <input
          type="date"
          name={key}
          value={formData[key] ? formatDateInput(formData[key]) : ""}
          onChange={handleChange}
          className="form-control"
        />
      );
    }

    return (
      <input
        type="text"
        name={key}
        value={formData[key] ?? ""}
        onChange={handleChange}
        placeholder={label}
        className="form-control"
      />
    );
  };

  return (
    <div className="profile-page container py-5">
      <h2 className="text-center text-primary mb-4">Employee Profile</h2>

      <div className="text-end mb-3">
        <Button onClick={() => setEditMode((prev) => !prev)}>
          {editMode ? "Cancel" : "Edit Profile"}
        </Button>
        {editMode && (
          <Button variant="success" className="ms-2" onClick={handleSave}>
            Save
          </Button>
        )}
      </div>

      <div className="profile-container d-flex flex-wrap gap-4 profile-scroll">
        {/* LEFT PANEL */}
        <div className="profile-left flex-shrink-0">
          <img
            src={imgPreview || "/default-avatar.png"}
            alt="Profile"
            style={{ width: "150px", borderRadius: "50%" }}
            className="mb-3"
          />

          {editMode && (
            <input
              type="file"
              name="img"
              accept="image/*"
              onChange={handleFileChange}
              className="form-control mb-2"
            />
          )}

          <h3>{employee.ename}</h3>

          {editMode && renderEditInput("ename", "Name")}

          <p>
            <strong>Employee ID:</strong> {employee.employeeId}
          </p>

          <p>
            <strong>User Type:</strong> {employee.userType}
          </p>
        </div>

        {/* RIGHT PANEL */}
        <div className="profile-right flex-grow-1">
          {/* PERSONAL */}
          <section>
            <h4>Personal Information</h4>
            <div className="row g-2">
              {[
                ["dateOfBirth", "DOB"],
                ["gender", "Gender"],
                ["phoneNo", "Phone"],
                ["personal_email", "Personal Email"],
                ["official_email", "Official Email"],
                ["fatherName", "Father"],
                ["motherName", "Mother"],
                ["address", "Address"],
                ["emergencyContact", "Emergency Contact"],
                ["relation", "Relation"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode
                    ? renderEditInput(key, label)
                    : (
                      <p>
                        <strong>{label}:</strong> {renderValue(key)}
                      </p>
                      )}
                </div>
              ))}
            </div>
          </section>

          {/* BANK */}
          <section className="mt-4">
            <h4>Bank Details</h4>
            <div className="row g-2">
              {[
                ["bankName", "Bank"],
                ["accountNo", "Account No"],
                ["ifscCode", "IFSC"],
                ["accountHolderName", "Holder"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode
                    ? renderEditInput(key, label)
                    : (
                      <p>
                        <strong>{label}:</strong> {renderValue(key)}
                      </p>
                      )}
                </div>
              ))}
            </div>
          </section>

          {/* DOCUMENTS */}
          <section className="mt-4">
            <h4>Identity & Documents</h4>
            <div className="row g-2">
              {[
                ["adarCardNo", "Aadhar"],
                ["panNo", "PAN"],
                ["qualification", "Qualification"],
                ["lastExp", "Last Exp"],
                ["expWithPWT", "Exp with PWT"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode
                    ? renderEditInput(key, label)
                    : (
                      <p>
                        <strong>{label}:</strong> {renderValue(key)}
                      </p>
                      )}
                </div>
              ))}
            </div>
          </section>

          {/* JOB / SALARY */}
          <section className="mt-4">
            <h4>Job & Salary Details</h4>
            <div className="row g-2">
              {[
                ["department", "Department"],
                ["service", "Service"],
                ["interviewDate", "Interview Date"],
                ["joiningDate", "Joining Date"],
                ["expectedSalary", "Expected Salary"],
                ["givenSalary", "Given Salary"],
                ["workingTime", "Working Time"],
              ].map(([key, label]) => (
                <div className="col-md-6" key={key}>
                  {editMode
                    ? renderEditInput(key, label)
                    : (
                      <p>
                        <strong>{label}:</strong> {renderValue(key)}
                      </p>
                      )}
                </div>
              ))}

              {/* Resume upload */}
              <div className="col-12 mt-2">
                <p>
                  <strong>Resume:</strong>{" "}
                  {employee.resumeFile ? (
                    <a href={employee.resumeFile} target="_blank" rel="noopener noreferrer"> 
                      View
                    </a>
                  ) : (
                    "N/A"
                  )}
                </p>

                {editMode && (
                  <input
                    type="file"
                    name="resumeFile"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileChange}
                    className="form-control"
                  />
                )}
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default EmployeeProfile;
