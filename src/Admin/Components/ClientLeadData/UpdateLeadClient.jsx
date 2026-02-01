import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../../../config";
import axiosInstance from '../../../../../frontend/src/utils/axiosInstance'

function UpdateLeadClient() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    leadName: "",
    emailId: "",
    phoneNo: "",
    sourse: "",
    department: "",
    service: "",
    project_type: "",
    project_price: "",
    start_date: "",
    assign: [],
    userType: "lead",
    status: "Cold",
  });

  // ✅ Fetch Departments
  useEffect(() => {
    axios.get(`${API_URL}/api/getDepartment`)
      .then(res => setDepartments(res.data))
      .catch(err => console.error("Error fetching departments:", err));
  }, []);

  // ✅ Fetch Services when department changes
  useEffect(() => {
    if (!formData.department) return;
    axios.get(`${API_URL}/api/getServicebyDepartment/${formData.department}`)
      .then(res => setServices(res.data))
      .catch(err => console.error("Error fetching services:", err));
  }, [formData.department]);

  // ✅ Fetch Employees when department changes
  useEffect(() => {
    if (!formData.department) return;
    axios.get(`${API_URL}/api/getEmployeeByDepartment/${formData.department}`)
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Error fetching employees:", err));
  }, [formData.department]);

  // ✅ Fetch Lead Data by ID (Pre-fill)
  useEffect(() => {
    axios.get(`${API_URL}/api/getClientLeadbyId/${leadId}`)
      .then(res => {
        const user = res.data.user || res.data;
        setFormData({
          leadName: user.leadName || "",
          emailId: user.emailId || "",
          phoneNo: user.phoneNo || "",
          sourse: user.sourse || "",
          department: user.department?._id || user.department || "",
          service: user.service?._id || user.service || "",
          project_type: user.project_type || "",
          project_price: user.project_price || "",
          start_date: user.date ? user.date.split("T")[0] : "",
          assign: Array.isArray(user.assign) ? user.assign.map(a => a._id || a) : [],
          userType: user.userType || "lead",
          status: user.status || "Cold",
        });
      })
      .catch(err => console.error("Error fetching lead:", err));
  }, [leadId]);

  // ✅ Validation rules
  const validateField = (name, value) => {
    let error = "";
    if (name === "leadName" && !value.trim()) error = "Name is required";
    if (name === "emailId" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
      error = "Invalid email address";
    if (name === "phoneNo") {
      if (!/^\d{10}$/.test(value)) error = "Enter valid 10-digit number";
    }
    if (name === "project_price" && value && value <= 0)
      error = "Price must be positive";
    if (name === "start_date") {
      const year = new Date(value).getFullYear();
      if (year < 2000 || year > 2100) error = "Invalid year in date";
    }
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  // ✅ Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "phoneNo") val = value.replace(/[^0-9]/g, ""); // Only digits
    if (name === "leadName") val = val.replace(/[^a-zA-Z\s]/g, ""); // Only letters
    setFormData({ ...formData, [name]: val });
    validateField(name, val);
  };

  // ✅ Handle Service Change (auto-fill price)
  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const selectedService = services.find((srv) => srv._id === selectedId);
    setFormData((prev) => ({
      ...prev,
      service: selectedId,
      project_price: selectedService ? selectedService.servicePrice : "",
    }));
  };

  // ✅ Submit Updated Data
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required
    const newErrors = {};
    ["leadName", "emailId", "phoneNo", "department"].forEach((field) => {
      validateField(field, formData[field]);
      if (!formData[field]) newErrors[field] = "This field is required";
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    try {
      setLoading(true);
      await axiosInstance.put(`${API_URL}/api/updateClientLead/${leadId}`, formData);
      alert("Lead updated successfully!");
      navigate("/admin/leads");
    } catch (err) {
      console.error(err);
      alert("Error updating lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-header bg-warning text-dark text-center">
          <h4>Update Client Lead</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit} className="row g-3">

            {/* Name */}
            <div className="col-md-6">
              <label className="form-label">Name *</label>
              <input
                type="text"
                name="leadName"
                className={`form-control ${errors.leadName ? "is-invalid" : ""}`}
                value={formData.leadName}
                onChange={handleChange}
              />
              {errors.leadName && <div className="text-danger small">{errors.leadName}</div>}
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="emailId"
                className={`form-control ${errors.emailId ? "is-invalid" : ""}`}
                value={formData.emailId}
                onChange={handleChange}
              />
              {errors.emailId && <div className="text-danger small">{errors.emailId}</div>}
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label className="form-label">Phone *</label>
              <input
                type="text"
                name="phoneNo"
                maxLength="10"
                className={`form-control ${errors.phoneNo ? "is-invalid" : ""}`}
                value={formData.phoneNo}
                onChange={handleChange}
              />
              {errors.phoneNo && <div className="text-danger small">{errors.phoneNo}</div>}
            </div>

            {/* Source */}
            <div className="col-md-6">
              <label className="form-label">Source</label>
              <select
                name="sourse"
                className="form-select"
                value={formData.sourse}
                onChange={handleChange}
              >
                <option value="">-- Select Source --</option>
                <option value="Google">Google</option>
                <option value="FaceBook">FaceBook</option>
                <option value="Instagram">Instagram</option>
                <option value="Website">Website</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Referral">Referral</option>
                <option value="Advertisement">Advertisement</option>
                <option value="WhatsApp Marketing">WhatsApp Marketing</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Department */}
            <div className="col-md-6">
              <label className="form-label">Department *</label>
              <select
                className={`form-select ${errors.department ? "is-invalid" : ""}`}
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
              {errors.department && <div className="text-danger small">{errors.department}</div>}
            </div>

            {/* Service */}
            <div className="col-md-6">
              <label className="form-label">Service</label>
              <select
                className="form-select"
                name="service"
                value={formData.service}
                onChange={handleServiceChange}
              >
                <option value="">-- Select Service --</option>
                {services.map((srv) => (
                  <option key={srv._id} value={srv._id}>
                    {srv.serviceName} (₹{srv.servicePrice})
                  </option>
                ))}
              </select>
            </div>

            {/* Price */}
            <div className="col-md-6">
              <label className="form-label">Project Price</label>
              <input
                type="number"
                name="project_price"
                className={`form-control ${errors.project_price ? "is-invalid" : ""}`}
                value={formData.project_price}
                onChange={handleChange}
              />
              {errors.project_price && <div className="text-danger small">{errors.project_price}</div>}
            </div>

            {/* Project Type */}
            <div className="col-md-6">
              <label className="form-label">Project Type</label>
              <select
                name="project_type"
                className="form-select"
                value={formData.project_type}
                onChange={handleChange}
              >
                <option value="">-- Select Project Type --</option>
                <option value="One-time Project">One-time Project</option>
                <option value="Recurring Project">Recurring Project</option>
                
                <option value="Other">Other</option>
              </select>
              {formData.project_type === "Other" && (
                <input
                  type="text"
                  className="form-control mt-2"
                  placeholder="Please specify"
                  name="project_type_other"
                  value={formData.project_type_other || ""}
                  onChange={handleChange}
                />
              )}
            </div>

            {/* Date */}
            <div className="col-md-6">
              <label className="form-label">Enroll Date</label>
              <input
                type="date"
                name="start_date"
                className={`form-control ${errors.start_date ? "is-invalid" : ""}`}
                value={formData.start_date}
                onChange={handleChange}
              />
              {errors.start_date && <div className="text-danger small">{errors.start_date}</div>}
            </div>

            {/* Assign To */}
            {/* <div className="col-md-12">
              <label className="form-label">Assign To</label>
              <Select
                isMulti
                options={employees.map(emp => ({ value: emp._id, label: emp.ename }))}
                value={employees
                  .filter(emp => formData.assign.includes(emp._id))
                  .map(emp => ({ value: emp._id, label: emp.ename }))}
                onChange={(selected) => {
                  setFormData(prev => ({ ...prev, assign: selected.map(s => s.value) }));
                }}
              />
            </div> */}

            {/* User Type */}
            <div className="col-md-6">
              <label className="form-label">User Type</label>
              <select
                name="userType"
                className="form-select"
                value={formData.userType}
                onChange={handleChange}
              >
                <option value="lead">Lead</option>
                <option value="client">Client</option>
              </select>
            </div>

            {/* Status */}
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                name="status"
                className="form-select"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Cold">Cold</option>
                <option value="Warm">Warm</option>
                <option value="Hot">Hot</option>
                <option value="Schedule Appointment">Schedule Appointment</option>
                <option value="Proposal sent">Proposal sent</option>
                <option value="Win">Win</option>
                <option value="Hold">Hold</option>
                <option value="Close">Close</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Submit */}
            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-success px-4" disabled={loading}>
                {loading ? "Updating..." : "Update Lead"}
              </button>
              <button
                type="button"
                className="btn btn-secondary px-4 ms-3"
                onClick={() => navigate("/admin/leads")}
              >
                Cancel
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}

export default UpdateLeadClient;
