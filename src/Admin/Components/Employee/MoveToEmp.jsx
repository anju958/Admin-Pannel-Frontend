import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function MoveToEmp() {
  const { employeeId } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ename: "",
    dateOfBirth: "",
    gender: "",
    phoneNo: "",
    personal_email: "",
    official_email: "",
    fatherName: "",
    motherName: "",
    address: "",
    emergencyContact: "",
    relation: "",
    bankName: "",
    accountNo: "",
    ifscCode: "",
    accountHolderName: "",
    adarCardNo: "",
    panNo: "",
    qualification: "",
    lastExp: "",
    expWithPWT: "",
    deptName: "",
    designation: "",
    interviewDate: "",
    joiningDate: "",
    expectedSalary: "",
    givenSalary: "",
    workingTime: "",
    userType: ""
  });

  const [resumeFile, setResumeFile] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [imgFile, setImgFile] = useState(null);

    useEffect(() => {
    axios
      .get("http://localhost:5000/api/getDepartment")
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  useEffect(() => {
    if (!formData.department) return;
    axios
      .get(`http://localhost:5000/api/getServicebyDepartment/${formData.department}`)
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, [formData.department]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleResumeChange = (e) => setResumeFile(e.target.files[0]);
  const handleImgChange = (e) => setImgFile(e.target.files[0]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
   Object.keys(formData).forEach((key) => {
      if (key !== "resumeFile" && key !== "img") {
        data.append(key, formData[key] ?? "");
      }
    });
    if (resumeFile) data.append("resumeFile", resumeFile);
    if (imgFile) data.append("img", imgFile);

    try {
      await axios.put(
        `http://localhost:5000/api/updateSignUser/${employeeId}`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert("Employee updated successfully!");
      navigate(formData.userType === "employee" ? "/admin/Employee" : "/admin/trainee");
    } catch (error) {
      console.error(error);
      alert("Error updating employee: " + error.message);
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow-lg p-4">
        <h3 className="text-center text-success mb-4">🚀 Move User to Employee</h3>
        <form onSubmit={handleSubmit} className="row g-3">

          {/* Personal Info */}
          <h5 className="text-primary mt-3">👤 Personal Information</h5>
          <div className="col-md-6">
            <label className="form-label">Employee Name</label>
            <input type="text" className="form-control" value={formData.ename} disabled />
          </div>
          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-control" value={formData.dateOfBirth?.split("T")[0] || ""} disabled />
          </div>

          {/* Contact */}
          <h5 className="text-primary mt-4">📞 Contact Details</h5>
          <div className="col-md-6">
            <label className="form-label">Phone No</label>
            <input type="text" className="form-control" value={formData.phoneNo} disabled />
          </div>
          <div className="col-md-6">
            <label className="form-label">Personal Email</label>
            <input type="email" className="form-control" value={formData.personal_email} disabled />
          </div>

          {/* Department & Designation */}
          <h5 className="text-primary mt-4">🏢 Job Details</h5>
          
          <h5 className="fw-semibold text-secondary mt-4">Professional Details</h5>
          <div className="col-md-6">
            <label className="form-label">Select Department</label>
            <select
              className="form-select"
              name="department"
              value={formData.department}
              onChange={handleChange}
            >
              <option value="">-- Select Department --</option>
              {departments.map((dept) => (
                <option key={dept._id} value={dept._id}>
                  {dept.deptName}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Select Service</label>
            <select
              className="form-select"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="">-- Select Service --</option>
              {services.map((srv) => (
                <option key={srv._id} value={srv._id}>
                  {srv.serviceName}
                </option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <h5 className="text-primary mt-4">💰 Salary Information</h5>
          <div className="col-md-6">
            <label className="form-label">Expected Salary</label>
            <input type="text" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} className="form-control" />
          </div>
          <div className="col-md-6">
            <label className="form-label">Given Salary</label>
            <input type="text" name="givenSalary" value={formData.givenSalary} onChange={handleChange} className="form-control" />
          </div>

          <div className="col-md-6">
            <label className="form-label">Working Time</label>
            <input type="text" name="workingTime" value={formData.workingTime} onChange={handleChange} className="form-control" />
          </div>

          {/* File Upload */}
          <div className="col-md-12">
            <label className="form-label">Upload Resume</label>
            <input type="file" className="form-control" onChange={handleResumeChange} disabled />
          </div>

          {/* User Type */}
          <div className="col-md-6">
            <label className="form-label">Employee Type</label>
            <select className="form-select" name="userType" value={formData.userType} onChange={handleChange}>
              <option value="">Select Type</option>
              <option value="employee">Employee</option>
            </select>
          </div>

          {/* Submit */}
          <div className="col-12 text-center mt-4">
            <button type="submit" className="btn btn-success px-5 py-2 rounded-pill shadow">
              ✅ Move to Employee
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default MoveToEmp;
