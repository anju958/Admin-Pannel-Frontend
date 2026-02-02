import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../../config";
import axiosInstance from '../../../utils/axiosInstance'

function AddEmployee() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    ename: '', dateOfBirth: '', gender: '', phoneNo: '',
    personal_email: '', official_email: '', password: '',
    fatherName: '', motherName: '', address: '', emergencyContact: '',
    relation: '', bankName: '', accountNo: '', ifscCode: '', accountHolderName: '',
    adarCardNo: '', panNo: '', qualification: '', lastExp: '', expWithPWT: '',
    department: '', service: '', interviewDate: '', joiningDate: '',
    expectedSalary: '', givenSalary: '', workingTime: '',
    resumeFile: null, userType: '', traineeDuration: '', img: null, jobId: ''
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Regex Patterns
  const regex = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^[0-9]{10}$/,
    aadhaar: /^[0-9]{12}$/,
    pan: /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/,
    account: /^[0-9]{9,18}$/,
    ifsc: /^[A-Z]{4}0[0-9A-Z]{6}$/
  };

  // Fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getDepartment`);
        setDepartments(res.data || []);
      } catch (err) {
        console.error("Error fetching departments:", err);
        alert("Failed to fetch departments");
      }
    };
    fetchDepartments();
  }, []);

  // Fetch services when department changes
  useEffect(() => {
    if (!formData.department) {
      setServices([]);
      return;
    }
    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await axios.get(`${API_URL}/api/getServicebyDepartment/${formData.department}`);
        setServices(res.data || []);
      } catch (err) {
        console.error("Error fetching services:", err);
        alert("Failed to fetch services");
        setServices([]);
      } finally {
        setLoadingServices(false);
      }
    };
    fetchServices();
  }, [formData.department]);

  // Handle changes with restrictions and live validation
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    let val = value;

    // Numeric-only fields
    const numberOnlyFields = [
      "phoneNo", "emergencyContact", "adarCardNo", "accountNo", "expectedSalary", "givenSalary", "workingTime"
    ];
    if (numberOnlyFields.includes(name)) {
      val = value.replace(/[^0-9]/g, "");
    }

    // Auto-uppercase fields
    if (name === "panNo" || name === "ifscCode") {
      val = value.toUpperCase();
    }

    // If department changes reset service
    if (name === "department") {
      setFormData(prev => ({ ...prev, department: val, service: '' }));
      setErrors(prev => ({ ...prev, department: '', service: '' }));
      return;
    }

    const updatedValue = type === 'file' ? files[0] : val;
    setFormData(prev => ({ ...prev, [name]: updatedValue }));

    // Clear error for this field immediately
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validate all fields, return errors object
  const validateAll = () => {
    const newErrors = {};
    const today = new Date().toISOString().split("T")[0];

    // Required checks (you can tweak which are required)
    if (!formData.ename || !formData.ename.trim()) newErrors.ename = "Employee name is required.";
    if (!formData.phoneNo) newErrors.phoneNo = "Contact number is required.";
    else if (!regex.phone.test(formData.phoneNo)) newErrors.phoneNo = "Phone number must be 10 digits.";

    if (formData.personal_email && !regex.email.test(formData.personal_email)) newErrors.personal_email = "Invalid personal email.";
    if (!formData.official_email) newErrors.official_email = "Official email is required.";
    else if (!regex.email.test(formData.official_email)) newErrors.official_email = "Invalid official email.";

    if (!formData.password) newErrors.password = "Password is required.";

    if (formData.adarCardNo && !regex.aadhaar.test(formData.adarCardNo)) newErrors.adarCardNo = "Aadhaar must be 12 digits.";
    if (formData.panNo && !regex.pan.test(formData.panNo)) newErrors.panNo = "PAN format invalid (e.g., ABCDE1234F).";

    if (formData.accountNo && !regex.account.test(formData.accountNo)) newErrors.accountNo = "Account number must be 9–18 digits.";
    if (formData.ifscCode && !regex.ifsc.test(formData.ifscCode)) newErrors.ifscCode = "IFSC invalid (e.g., SBIN0001234).";

    if (formData.dateOfBirth) {
      // Guard against very long/invalid numbers typed into date field: new Date(...) handles invalid strings
      const dobValid = !isNaN(new Date(formData.dateOfBirth).getTime());
      if (!dobValid) newErrors.dateOfBirth = "Please enter a valid Date of Birth.";
      else if (formData.dateOfBirth > today) newErrors.dateOfBirth = "Date of Birth cannot be in the future.";
    }

    if (formData.interviewDate) {
      const intValid = !isNaN(new Date(formData.interviewDate).getTime());
      if (!intValid) newErrors.interviewDate = "Please enter a valid Interview Date.";
    }
    if (formData.joiningDate) {
      const joinValid = !isNaN(new Date(formData.joiningDate).getTime());
      if (!joinValid) newErrors.joiningDate = "Please enter a valid Joining Date.";
      if (formData.interviewDate && formData.joiningDate < formData.interviewDate) newErrors.joiningDate = "Joining date cannot be before interview date.";
    }

    if (!formData.department) newErrors.department = "Please select a department.";
    if (!formData.service) newErrors.service = "Please select a service.";

    // Optionally check traineeDuration when userType is trainee/intern
    if ((formData.userType === 'trainee' || formData.userType === 'intern') && !formData.traineeDuration) {
      newErrors.traineeDuration = "Please select trainee duration.";
    }

    return newErrors;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const validated = validateAll();
    setErrors(validated);
    if (Object.keys(validated).length > 0) {
      // focus first error field (optional UX nicety)
      const firstKey = Object.keys(validated)[0];
      const el = document.getElementsByName(firstKey)[0];
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    try {
      const data = new FormData();

      // Append fields except files
      Object.keys(formData).forEach((key) => {
        if (formData[key] !== undefined && formData[key] !== null && key !== "resumeFile" && key !== "img") {
          data.append(key, formData[key]);
        }
      });

      // Append files
      if (formData.resumeFile) data.append("resumeFile", formData.resumeFile);
      if (formData.img) data.append("img", formData.img);

      // Temporary jobId if missing
      if (!formData.jobId) data.append("jobId", "JOB123");

      const res = await axiosInstance.post(`${API_URL}/api/signUp`, data, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      alert("✅ Registration Completed Successfully!");
      console.log("Response:", res.data);

      if (formData.userType === 'employee') navigate("/admin/employee");
      else navigate("/admin/trainee");
    } catch (err) {
      console.error("Submit error:", err);
      alert("❌ Failed to submit form.");
    }
  };

  return (
    <div className="container my-4" style={{ maxHeight: "90vh", overflowY: "auto" }}>
      <form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white">

        <h3 className="text-center mb-4 fw-bold">Add Employee</h3>

        {/* Personal Info */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Personal Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Employee Full Name</label>
              <input type="text" className={`form-control ${errors.ename ? 'is-invalid' : ''}`} name="ename"
                value={formData.ename} onChange={handleChange} />
              {errors.ename && <small className="text-danger">{errors.ename}</small>}
            </div>

            <div className="col-md-6">
              <label>Date of Birth</label>
              <input type="date" className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`} name="dateOfBirth"
                value={formData.dateOfBirth} onChange={handleChange} />
              {errors.dateOfBirth && <small className="text-danger">{errors.dateOfBirth}</small>}
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
              <input type="text" className={`form-control ${errors.phoneNo ? 'is-invalid' : ''}`} name="phoneNo"
                value={formData.phoneNo} onChange={handleChange} maxLength={10} />
              {errors.phoneNo && <small className="text-danger">{errors.phoneNo}</small>}
            </div>
          </div>
        </div>

        {/* Contact & Login */}
        <div className="card mb-4">
          <div className="card-header bg-success text-white">Contact & Login</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Personal Email</label>
              <input type="email" className={`form-control ${errors.personal_email ? 'is-invalid' : ''}`} name="personal_email"
                value={formData.personal_email} onChange={handleChange} />
              {errors.personal_email && <small className="text-danger">{errors.personal_email}</small>}
            </div>
            <div className="col-md-6">
              <label>Official Email</label>
              <input type="email" className={`form-control ${errors.official_email ? 'is-invalid' : ''}`} name="official_email"
                value={formData.official_email} onChange={handleChange} />
              {errors.official_email && <small className="text-danger">{errors.official_email}</small>}
            </div>

            <div className="col-md-6">
              <label>Password</label>
              <input type="password" className={`form-control ${errors.password ? 'is-invalid' : ''}`} name="password"
                value={formData.password} onChange={handleChange} />
              {errors.password && <small className="text-danger">{errors.password}</small>}
            </div>
          </div>
        </div>

        {/* Family Info */}
        <div className="card mb-4">
          <div className="card-header bg-info text-white">Family Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Father Name</label>
              <input type="text" className="form-control" name="fatherName" value={formData.fatherName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Mother Name</label>
              <input type="text" className="form-control" name="motherName" value={formData.motherName} onChange={handleChange} />
            </div>
            <div className="col-md-12">
              <label>Address</label>
              <input type="text" className="form-control" name="address" value={formData.address} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Emergency Contact</label>
              <input type="text" className={`form-control ${errors.emergencyContact ? 'is-invalid' : ''}`} name="emergencyContact"
                value={formData.emergencyContact} onChange={handleChange} maxLength={10} />
              {errors.emergencyContact && <small className="text-danger">{errors.emergencyContact}</small>}
            </div>
            <div className="col-md-6">
              <label>Relation with Emergency Contact</label>
              <input type="text" className="form-control" name="relation" value={formData.relation} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="card mb-4">
          <div className="card-header bg-warning">Bank Account Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Bank Name</label>
              <input type="text" className="form-control" name="bankName" value={formData.bankName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Account Number</label>
              <input type="text" className={`form-control ${errors.accountNo ? 'is-invalid' : ''}`} name="accountNo"
                value={formData.accountNo} onChange={handleChange} maxLength={18} />
              {errors.accountNo && <small className="text-danger">{errors.accountNo}</small>}
            </div>
            <div className="col-md-6">
              <label>IFSC Code</label>
              <input type="text" className={`form-control ${errors.ifscCode ? 'is-invalid' : ''}`} name="ifscCode"
                value={formData.ifscCode} onChange={handleChange} maxLength={11} />
              {errors.ifscCode && <small className="text-danger">{errors.ifscCode}</small>}
            </div>
            <div className="col-md-6">
              <label>Account Holder Name</label>
              <input type="text" className="form-control" name="accountHolderName" value={formData.accountHolderName} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Aadhaar Card Number</label>
              <input type="text" className={`form-control ${errors.adarCardNo ? 'is-invalid' : ''}`} name="adarCardNo"
                value={formData.adarCardNo} onChange={handleChange} maxLength={12} />
              {errors.adarCardNo && <small className="text-danger">{errors.adarCardNo}</small>}
            </div>
            <div className="col-md-6">
              <label>PAN Card Number</label>
              <input type="text" className={`form-control ${errors.panNo ? 'is-invalid' : ''}`} name="panNo"
                value={formData.panNo} onChange={handleChange} maxLength={10} />
              {errors.panNo && <small className="text-danger">{errors.panNo}</small>}
            </div>
          </div>
        </div>

        {/* Qualification & Experience */}
        <div className="card mb-4">
          <div className="card-header bg-secondary text-white">Qualification & Experience</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Qualification</label>
              <input type="text" className="form-control" name="qualification" value={formData.qualification} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Last Experience</label>
              <input type="text" className="form-control" name="lastExp" value={formData.lastExp} onChange={handleChange} />
            </div>
            <div className="col-md-6">
              <label>Experience with PWT</label>
              <input type="text" className="form-control" name="expWithPWT" value={formData.expWithPWT} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Job Info */}
        <div className="card mb-4">
          <div className="card-header bg-danger text-white">Job Information</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Select Department</label>
              <select className={`form-control ${errors.department ? 'is-invalid' : ''}`} name="department"
                value={formData.department} onChange={handleChange} required>
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>{dept.deptName}</option>
                ))}
              </select>
              {errors.department && <small className="text-danger">{errors.department}</small>}
            </div>

            <div className="col-md-6">
              <label>Select Service</label>
              <select className={`form-control ${errors.service ? 'is-invalid' : ''}`} name="service"
                value={formData.service} onChange={handleChange} disabled={!formData.department || loadingServices} required>
                <option value="">{loadingServices ? "Loading services..." : !formData.department ? "First select a department" : "-- Select Service --"}</option>
                {services.map((srv) => (
                  <option key={srv._id} value={srv._id}>{srv.serviceName}</option>
                ))}
              </select>
              {formData.department && services.length === 0 && !loadingServices && <small className="text-danger">No services available for this department</small>}
              {errors.service && <small className="text-danger">{errors.service}</small>}
            </div>

            <div className="col-md-6">
              <label>Interview Date</label>
              <input type="date" className={`form-control ${errors.interviewDate ? 'is-invalid' : ''}`} name="interviewDate"
                value={formData.interviewDate} onChange={handleChange} />
              {errors.interviewDate && <small className="text-danger">{errors.interviewDate}</small>}
            </div>

            <div className="col-md-6">
              <label>Joining Date</label>
              <input type="date" className={`form-control ${errors.joiningDate ? 'is-invalid' : ''}`} name="joiningDate"
                value={formData.joiningDate} onChange={handleChange} />
              {errors.joiningDate && <small className="text-danger">{errors.joiningDate}</small>}
            </div>

            <div className="col-md-6">
              <label>Expected Salary</label>
              <input type="text" className="form-control" name="expectedSalary" value={formData.expectedSalary} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>Given Salary</label>
              <input type="text" className="form-control" name="givenSalary" value={formData.givenSalary} onChange={handleChange} />
            </div>

            <div className="col-md-6">
              <label>Working Hours</label>
              <input type="text" className="form-control" name="workingTime" value={formData.workingTime} onChange={handleChange} />
            </div>
          </div>
        </div>

        {/* Uploads */}
        <div className="card mb-4">
          <div className="card-header bg-dark text-white">Uploads</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Upload Resume</label>
              <input type="file" className="form-control" name="resumeFile" onChange={handleChange} accept=".pdf,.doc,.docx" />
            </div>
            <div className="col-md-6">
              <label>Upload Image</label>
              <input type="file" className="form-control" name="img" onChange={handleChange} accept="image/*" />
            </div>
          </div>
        </div>

        {/* Employee Type */}
        <div className="card mb-4">
          <div className="card-header bg-primary text-white">Employee Type</div>
          <div className="card-body row g-3">
            <div className="col-md-6">
              <label>Select User Type</label>
              <select className="form-select" name="userType" value={formData.userType} onChange={handleChange} required>
                <option value="">Select Type</option>
                <option value="employee">Employee</option>
                <option value="trainee">Trainee</option>
                <option value="intern">Intern</option>
              </select>
            </div>

            {(formData.userType === 'trainee' || formData.userType === 'intern') && (
              <div className="col-md-6">
                <label>Trainee Duration</label>
                <select className={`form-select ${errors.traineeDuration ? 'is-invalid' : ''}`} name="traineeDuration"
                  value={formData.traineeDuration} onChange={handleChange}>
                  <option value="">Select Duration</option>
                  <option value="3">3 Months</option>
                  <option value="6">6 Months</option>
                  <option value="12">12 Months</option>
                </select>
                {errors.traineeDuration && <small className="text-danger">{errors.traineeDuration}</small>}
              </div>
            )}
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary px-5 py-2">✅ Add Employee</button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployee;
