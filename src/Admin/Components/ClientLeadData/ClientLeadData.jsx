
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../../../config";

function ClientLead() {
  const navigate = useNavigate();

  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
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
    assign: [], // ✅ must be array
    userType: "lead",
    status: "Cold",
  });

  const [loading, setLoading] = useState(false);

  // Fetch Departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getDepartment`);
        setDepartments(res.data);
      } catch (err) {
        console.error("Error fetching departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  // Fetch Services when department changes
  useEffect(() => {
    if (!formData.department) return;
    const fetchServices = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/getServicebyDepartment/${formData.department}`
        );
        setServices(res.data);
      } catch (err) {
        console.error("Error fetching services:", err);
      }
    };
    fetchServices();
  }, [formData.department]);

  // Fetch Employees when department changes
  useEffect(() => {
    if (!formData.department) return;
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/getEmployeeByDepartment/${formData.department}`
        );
        setEmployees(res.data);
      } catch (err) {
        console.error("Error fetching employees:", err);
      }
    };
    fetchEmployees();
  }, [formData.department]);

  // Handle Input Change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle Service Change (auto-fill price)
  const handleServiceChange = (e) => {
    const selectedService = services.find((srv) => srv._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      service: e.target.value,
      project_price: selectedService ? selectedService.servicePrice : "",
    }));
  };

  // Validate & Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Frontend Validation
    if (
      !formData.leadName ||
      !formData.emailId ||
      !formData.phoneNo ||
      !formData.department ||
      !formData.userType
    ) {
      alert("Please fill all required fields!");
      return;
    }

    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/genClientLead`, formData);
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
                className="form-control"
                value={formData.leadName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="col-md-6">
              <label className="form-label">Email *</label>
              <input
                type="email"
                name="emailId"
                className="form-control"
                value={formData.emailId}
                onChange={handleChange}
                required
              />
            </div>

            {/* Phone */}
            <div className="col-md-6">
              <label className="form-label">Phone *</label>
              <input
                type="text"
                name="phoneNo"
                className="form-control"
                value={formData.phoneNo}
                onChange={handleChange}
                required
              />
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
                className="form-select"
                value={formData.department}
                onChange={handleChange}
                required
              >
                <option value="">-- Select Department --</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.deptName}
                  </option>
                ))}
              </select>
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

            {/* Project Price */}
            <div className="col-md-6">
              <label className="form-label">Project Price</label>
              <input
                type="number"
                name="project_price"
                className="form-control"
                value={formData.project_price}
                onChange={handleChange}
              />
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
                <option value="Web Development">Web Development</option>
                <option value="Mobile App Development">Mobile App Development</option>
                <option value="Software Development">Software Development</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Cloud Solutions">Cloud Solutions</option>
                <option value="IT Consulting">IT Consulting</option>
                <option value="AI/ML Projects">AI/ML Projects</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Other">Other</option>
              </select>
            </div>

            {/* Start Date */}
            <div className="col-md-6">
              <label className="form-label">Enroll Date</label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                value={formData.start_date}
                onChange={handleChange}
              />
            </div>

            {/* User Type */}
            <div className="col-md-6">
              <label className="form-label">User Type *</label>
              <select
                name="userType"
                className="form-select"
                value={formData.userType}
                onChange={handleChange}
                required
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
                {loading ? "Adding..." : "Add Lead"}
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
