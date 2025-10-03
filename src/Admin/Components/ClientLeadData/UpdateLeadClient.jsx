import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

function UpdateLeadClient() {
  const { leadId } = useParams();
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
    assign: [],
    userType: "lead",
    status: "Cold",
  });

  // Fetch Departments
  useEffect(() => {
    axios.get("http://localhost:5000/api/getDepartment")
      .then(res => setDepartments(res.data))
      .catch(err => console.error("Error fetching departments:", err));
  }, []);

  // Fetch Services when department changes
  useEffect(() => {
    if (!formData.department) return;
    axios.get(`http://localhost:5000/api/getServicebyDepartment/${formData.department}`)
      .then(res => setServices(res.data))
      .catch(err => console.error("Error fetching services:", err));
  }, [formData.department]);

  // Fetch Employees when department changes
  useEffect(() => {
    if (!formData.department) return;
    axios.get(`http://localhost:5000/api/getEmployeeByDepartment/${formData.department}`)
      .then(res => setEmployees(res.data))
      .catch(err => console.error("Error fetching employees:", err));
  }, [formData.department]);

  // Fetch Lead Data by ID (Pre-fill)
  useEffect(() => {
    axios.get(`http://localhost:5000/api/getClientLeadbyId/${leadId}`)
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

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle service change (auto-fill price)
  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const selectedService = services.find((srv) => srv._id === selectedId);

    setFormData((prev) => ({
      ...prev,
      service: selectedId,
      project_price: selectedService ? selectedService.servicePrice : "",
    }));
  };

  // Submit updated data
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:5000/api/updateClientLead/${leadId}`,
        formData
      );
      alert("Lead updated successfully!");
      navigate("/admin/leads");
    } catch (err) {
      console.error(err);
      alert("Error updating lead");
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
              <label className="form-label">Name</label>
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
              <label className="form-label">Email</label>
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
              <label className="form-label">Phone</label>
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
                required
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
              <label className="form-label fw-bold">Select Department</label>
              <select
                className="form-select rounded-pill"
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

            {/* Service */}
            <div className="col-md-6">
              <label className="form-label">Service</label>
              <select
                className="form-select rounded-pill"
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

            {/* Enroll Date */}
            <div className="col-md-6">
              <label className="form-label">Enroll Date</label>
              <input
                type="date"
                name="start_date"
                className="form-control"
                value={formData.start_date}
                onChange={handleChange}
                required
              />
            </div>

            {/* Assigned To (Multi Select) */}
            <div className="col-md-12">
              <label className="form-label">Assign To</label>
              <Select
                isMulti
                options={employees.map(emp => ({ value: emp._id, label: emp.ename }))}
                value={employees.filter(emp => formData.assign.includes(emp._id))
                  .map(emp => ({ value: emp._id, label: emp.ename }))}
                onChange={(selected) => {
                  setFormData(prev => ({ ...prev, assign: selected.map(s => s.value) }));
                }}
              />
            </div>

            {/* User Type */}
            <div className="col-md-6">
              <label className="form-label">User Type</label>
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

            {/* Submit */}
            <div className="col-12 text-center mt-3">
              <button type="submit" className="btn btn-success px-4">
                Update Lead
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
