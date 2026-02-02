import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import axiosInstance from '../../../utils/axiosInstance'//new  fill this every where 

function ClientLead() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [errors, setErrors] = useState({});

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
    isCustomPrice: false,
  });

  const [loading, setLoading] = useState(false);

  // Fetch Departments
  useEffect(() => {
    axios.get(`${API_URL}/api/getDepartment`)
      .then((res) => setDepartments(res.data))
      .catch((err) => console.error("Error fetching departments:", err));
  }, []);

  // Fetch Services
  useEffect(() => {
    if (!formData.department) return;
    axios.get(`${API_URL}/api/getServicebyDepartment/${formData.department}`)
      .then((res) => setServices(res.data))
      .catch((err) => console.error("Error fetching services:", err));
  }, [formData.department]);

  // Fetch Employees
  useEffect(() => {
    if (!formData.department) return;
    axios.get(`${API_URL}/api/getEmployeeByDepartment/${formData.department}`)
      .then((res) => setEmployees(res.data))
      .catch((err) => console.error("Error fetching employees:", err));
  }, [formData.department]);

  // Field Validation Rules
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
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  // Handle Change
  const handleChange = (e) => {
    const { name, value } = e.target;
    let val = value;
    if (name === "phoneNo") val = value.replace(/[^0-9]/g, ""); // Only digits
    if (name === "leadName") val = val.replace(/[^a-zA-Z\s]/g, ""); // Only letters

    setFormData({ ...formData, [name]: val });
    validateField(name, val);
  };

  // Handle Price
  const handlePriceChange = (e) => {
    const value = e.target.value;
    setFormData({
      ...formData,
      project_price: value,
      isCustomPrice: true,
    });
    validateField("project_price", value);
  };

  // Handle Service Change
  const handleServiceChange = (e) => {
    const selectedService = services.find((srv) => srv._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      service: e.target.value,
      project_price:
        !prev.isCustomPrice && selectedService
          ? selectedService.servicePrice
          : prev.project_price,
      isCustomPrice: false,
    }));
  };

  // Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all required fields
    const newErrors = {};
    ["leadName", "emailId", "phoneNo", "department", "userType"].forEach((field) => {
      validateField(field, formData[field]);
      if (!formData[field]) newErrors[field] = "This field is required";
    });
    setErrors(newErrors);
    if (Object.values(newErrors).some((err) => err)) return;

    try {
      setLoading(true);
      await axiosInstance.post(`${API_URL}/api/genClientLead`, formData);
      alert("Lead Added Successfully!");
      navigate("/admin/leads");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Error adding lead");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-header bg-primary text-white text-center">
          <h4>Add New Client Lead</h4>
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
                name="department"
                className={`form-select ${errors.department ? "is-invalid" : ""}`}
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
                name="service"
                className="form-select"
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
                onChange={handlePriceChange}
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
                  name="project_type_other"
                  className="form-control mt-2"
                  placeholder="Please specify"
                  value={formData.project_type_other || ""}
                  onChange={handleChange}
                />
              )}
            </div>

            {/* Enroll Date */}
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

            {/* User Type */}
            <div className="col-md-6">
              <label className="form-label">User Type *</label>
              <select
                name="userType"
                className={`form-select ${errors.userType ? "is-invalid" : ""}`}
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

            {/* Buttons */}
            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-success px-4" disabled={loading}>
                {loading ? "Adding..." : "Submit Data"}
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

export default ClientLead;
