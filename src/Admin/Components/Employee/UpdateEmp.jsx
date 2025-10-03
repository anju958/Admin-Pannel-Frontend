import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function UpdateEmp() {
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
    department: "",
    service: "",
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
      .get(`http://localhost:5000/api/getEmpDataByID/${employeeId}`)
      .then((res) => setFormData(res.data))
      .catch((err) => console.log(err));
  }, [employeeId]);

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
      if (formData.userType === "employee") navigate("/admin/Employee");
      else navigate("/admin/trainee");
    } catch (error) {
      console.error(error);
      alert("Error updating employee: " + error.message);
    }
  };

  return (
    <div className="container my-5">
      <div className="card shadow-lg p-4 rounded-4">
        <h3 className="text-center mb-4 text-primary fw-bold">
          Update Employee Details
        </h3>

        <form onSubmit={handleSubmit} className="row g-4">
          {/* Basic Information */}
          <h5 className="fw-semibold text-secondary mt-3">Basic Information</h5>
          <div className="col-md-6">
            <label className="form-label">Employee Name</label>
            <input
              type="text"
              name="ename"
              value={formData.ename}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter employee name"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth?.split("T")[0] || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Phone Number</label>
            <input
              type="text"
              name="phoneNo"
              value={formData.phoneNo}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter phone number"
            />
          </div>

          {/* Contact Info */}
          <h5 className="fw-semibold text-secondary mt-4">Contact Information</h5>
          <div className="col-md-6">
            <label className="form-label">Personal Email</label>
            <input
              type="email"
              name="personal_email"
              value={formData.personal_email}
              onChange={handleChange}
              className="form-control"
              placeholder="example@gmail.com"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Official Email</label>
            <input
              type="email"
              name="official_email"
              value={formData.official_email}
              onChange={handleChange}
              className="form-control"
              placeholder="official@company.com"
            />
          </div>

          {/* Family Info */}
          <h5 className="fw-semibold text-secondary mt-4">Family Information</h5>
          <div className="col-md-6">
            <label className="form-label">Father Name</label>
            <input
              type="text"
              name="fatherName"
              value={formData.fatherName}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Mother Name</label>
            <input
              type="text"
              name="motherName"
              value={formData.motherName}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-12">
            <label className="form-label">Address</label>
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="form-control"
              rows="2"
              placeholder="Enter full address"
            />
          </div>

          {/* Professional Info */}
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

          <div className="col-md-6">
            <label className="form-label">Interview Date</label>
            <input
              type="date"
              name="interviewDate"
              value={formData.interviewDate?.split("T")[0] || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Joining Date</label>
            <input
              type="date"
              name="joiningDate"
              value={formData.joiningDate?.split("T")[0] || ""}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Expected Salary</label>
            <input
              type="text"
              name="expectedSalary"
              value={formData.expectedSalary}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Given Salary</label>
            <input
              type="text"
              name="givenSalary"
              value={formData.givenSalary}
              onChange={handleChange}
              className="form-control"
            />
          </div>

          {/* Upload Section */}
          <h5 className="fw-semibold text-secondary mt-4">Documents</h5>
          <div className="col-md-6">
            <label className="form-label">Upload Resume</label>
            <input
              type="file"
              name="resumeFile"
              onChange={handleResumeChange}
              className="form-control"
              accept=".pdf,.doc,.docx"
            />
          </div>

          <div className="col-md-6">
            <label className="form-label">Upload Image</label>
            <input
              type="file"
              name="img"
              onChange={handleImgChange}
              className="form-control"
              accept="image/*"
            />
          </div>

          <div className="col-md-12 text-center mt-4">
            <button type="submit" className="btn btn-success px-5 py-2 rounded-pill shadow-sm">
              Update User
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UpdateEmp;
