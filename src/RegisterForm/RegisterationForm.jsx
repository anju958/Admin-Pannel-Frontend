import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import logo from '../assessts/premier-logo.png';
import { API_URL } from "../config";

function RegisterationForm() {

  const [formData, setFormData] = useState({
    ename: '', dateOfBirth: '', gender: '', phoneNo: '',
    personal_email: '', official_email: '', password: '',
    fatherName: '', motherName: '', address: '', emergencyContact: '',
    
    relation: '', bankName: '', accountNo: '', ifscCode: '', accountHolderName: '',
    adarCardNo: '', panNo: '', qualification: '', lastExp: '', expWithPWT: '',
    department: '', service: '', interviewDate: '', joiningDate: '',
    expectedSalary: '', givenSalary: '', workingTime: '',
    resumeFile: null, userType: '', traineeDuration: '', img: null
  });

  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);

  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'file' ? files[0] : value
    }));
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getDepartment`);
        setDepartments(res.data);
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    if (!formData.department) return;
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/getServicebyDepartment/${formData.department}`
        );
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }

    };
    fetchServices();
  }, [formData.department]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();

      // append all text fields (except files)
      Object.keys(formData).forEach((key) => {
        if (formData[key] && key !== "resumeFile" && key !== "img") {
          data.append(key, formData[key]);
        }
      });

      // append files separately
      if (formData.resumeFile) {
        data.append("resumeFile", formData.resumeFile);
      }
      if (formData.img) {
        data.append("img", formData.img);
      }

      // TEMP FIX: ensure jobId exists
      if (!formData.jobId) {
        data.append("jobId", "JOB123");
      }

      const res = await axios.post(`${API_URL}/api/signUp`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Registration Completed");
      console.log("Response:", res.data);
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Failed to submit form.");
    }
  };

  return (
    <div className="container my-4">
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">

        <div className="d-flex justify-content-center mb-4">
          <img
            src={logo}
            alt="Premier Logo"
            width="160"
            className="shadow-sm "
          />
        </div>
        <h3 className="text-center mb-4 fw-bold">Add Employee</h3>

        {/* Personal Info */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Personal Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Employee Full Name</label>
              <input type="text" className="form-control" name="ename"
                value={formData.ename} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Date of Birth</label>
              <input type="date" className="form-control" name="dateOfBirth"
                value={formData.dateOfBirth} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Gender</label>
              <select className="form-select" name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div className="col-md-6">
              <label>Contact Number</label>
              <input type="text" className="form-control" name="phoneNo"
                value={formData.phoneNo} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Contact & Login */}
        <div className="card mb-4">
          <div className="card-header bg-success text-white">Contact & Login</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Personal Email</label>
              <input type="email" className="form-control" name="personal_email"
                value={formData.personal_email} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Official Email</label>
              <input type="email" className="form-control" name="official_email"
                value={formData.official_email} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Password</label>
              <input type="password" className="form-control" name="password"
                value={formData.password} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Family Info */}
        <div className="card mb-4">
          <div className="card-header bg-info text-white">Family Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Father Name</label>
              <input type="text" className="form-control" name="fatherName"
                value={formData.fatherName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Mother Name</label>
              <input type="text" className="form-control" name="motherName"
                value={formData.motherName} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label>Address</label>
              <input type="text" className="form-control" name="address"
                value={formData.address} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Emergency Contact</label>
              <input type="text" className="form-control" name="emergencyContact"
                value={formData.emergencyContact} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Relation with Emergency Contact</label>
              <input type="text" className="form-control" name="relation"
                value={formData.relation} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="card mb-4">
          <div className="card-header bg-warning">Bank Account Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Bank Name</label>
              <input type="text" className="form-control" name="bankName"
                value={formData.bankName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Account Number</label>
              <input type="text" className="form-control" name="accountNo"
                value={formData.accountNo} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>IFSC Code</label>
              <input type="text" className="form-control" name="ifscCode"
                value={formData.ifscCode} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Account Holder Name</label>
              <input type="text" className="form-control" name="accountHolderName"
                value={formData.accountHolderName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Aadhaar Card Number</label>
              <input type="text" className="form-control" name="adarCardNo"
                value={formData.adarCardNo} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>PAN Card Number</label>
              <input type="text" className="form-control" name="panNo"
                value={formData.panNo} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Qualification & Experience */}
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Qualification & Experience</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Qualification</label>
              <input type="text" className="form-control" name="qualification"
                value={formData.qualification} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Last Experience</label>
              <input type="text" className="form-control" name="lastExp"
                value={formData.lastExp} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Experience with PWT</label>
              <input type="text" className="form-control" name="expWithPWT"
                value={formData.expWithPWT} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="card mb-4">
          <div className="card-header bg-danger text-white">Job Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Select Department</label>
              <select className="form-control" name="department"
                value={formData.department} onChange={handleChange}>
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.deptName}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label>Select Service</label>
              <select className="form-control" name="service"
                value={formData.service} onChange={handleChange}>
                <option value="">-- Select Service --</option>
                {services.map((srv) => (
                  <option key={srv._id} value={srv._id}>{srv.serviceName}</option>
                ))}
              </select>
            </div>
            <div className="col-md-6">
              <label>Interview Date</label>
              <input type="date" className="form-control" name="interviewDate"
                value={formData.interviewDate} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Joining Date</label>
              <input type="date" className="form-control" name="joiningDate"
                value={formData.joiningDate} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Expected Salary</label>
              <input type="text" className="form-control" name="expectedSalary"
                value={formData.expectedSalary} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Given Salary</label>
              <input type="text" className="form-control" name="givenSalary"
                value={formData.givenSalary} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Working Hours</label>
              <input type="text" className="form-control" name="workingTime"
                value={formData.workingTime} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Uploads */}
        <div className="card mb-4">
          <div className="card-header bg-dark text-white">Uploads</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Upload Resume</label>
              <input type="file" className="form-control" name="resumeFile"
                onChange={handleChange} accept=".pdf,.doc,.docx" />
            </div>
            <div className="col-md-6">
              <label>Upload Image</label>
              <input type="file" className="form-control" name="img"
                onChange={handleChange} accept="image/*" />
            </div>
          </div>
        </div>

        {/* Employee Type */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Employee Type</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <select className="form-select" name="userType"
                value={formData.userType} onChange={handleChange}>
                <option value="">Select Type</option>
                <option value="employee">Employee</option>
                <option value="trainee">Trainee</option>
                <option value="intern">Intern</option>
              </select>
            </div>
            {formData.userType === 'trainee' && (
              <div className="col-md-6">
                <label>Trainee Duration</label>
                <select className="form-select" name="traineeDuration"
                  value={formData.traineeDuration} onChange={handleChange}>
                  <option value="">Select Duration</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                </select>
              </div>
            )}
          </div>
        </div>

        {/* Submit */}

        <div className="text-center">
          <button type="submit" className="btn btn-primary px-5">Add Employee</button>
          <div className="mt-3">
            <span>Already have an account? <Link to="/Login">Login</Link></span>
          </div>
        </div>
      </form>
    </div>
  );
}

export default RegisterationForm;
