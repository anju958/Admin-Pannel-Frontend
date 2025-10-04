import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { API_URL } from "../../../config";

function AddProject() {
  const { clientId } = useParams();
  const location = useLocation();
  const clientData = location.state?.client;

  const [formData, setFormData] = useState({
    projectName: "",
    department: "",
    service: "",
    startDate: "",
    endDate: "",
    projectCategory: [],
    clientId: clientData?._id || clientId || "",
    displayClientId: clientData?.leadId || "",
    clientName: clientData?.leadName || "",
    notes: "",
    addFile: null,
    budget: "",
    projectDescription: "",
    price: "",
    assign: [],
  });

  const [categories, setCategories] = useState([
    { value: "Laravel", label: "Laravel" },
    { value: "Vuejs", label: "Vuejs" },
    { value: "React", label: "React" },
    { value: "Zend", label: "Zend" },
    { value: "CakePhp", label: "CakePhp" },
  ]);

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

  // Prefill client data if available
  useEffect(() => {
    if (clientData) {
      setFormData((prev) => ({
        ...prev,
        clientId: clientData._id,
        clientName: clientData.leadName,
        displayClientId: clientData.leadId,
      }));
    }
  }, [clientData]);

  // Fetch Departments
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

  // Fetch Services by Department
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

  // Fetch Employees by Department
  useEffect(() => {
    if (!formData.department) return;
    const fetchEmployees = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/getEmployeeByDepartment/${formData.department}`
        );
        setEmployees(res.data);
      } catch (error) {
        console.error("Error fetching employees:", error);
      }
    };
    fetchEmployees();
  }, [formData.department]);

  // Handle Service Change (Auto-fill Price)
  const handleServiceChange = (e) => {
    const selectedId = e.target.value;
    const selectedService = services.find((srv) => srv._id === selectedId);
    setFormData((prev) => ({
      ...prev,
      service: selectedId,
      price: selectedService ? selectedService.servicePrice : "",
    }));
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, addFile: e.target.files[0] });
  };

  
  const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = new FormData();
    for (const key in formData) {
      if (key === "projectCategory") {
        data.append("projectCategory", JSON.stringify(formData.projectCategory));
      } else {
        data.append(key, formData[key]);
      }
    }
    data.append("addMember", JSON.stringify(formData.assign));

    await axios.post(`${API_URL}/api/addProject`, data, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    alert("Project added successfully!");
    setFormData({
      projectName: "",
      department: "",
      service: "",
      startDate: "",
      endDate: "",
      projectCategory: [], // reset as array
      clientId: clientData?._id || "",
      displayClientId: clientData?.leadId || "",
      clientName: clientData?.leadName || "",
      notes: "",
      addFile: null,
      budget: "",
      projectDescription: "",
      price: "",
      assign: [],
    });
  } catch (err) {
    console.error("Error adding project:", err.response?.data || err.message);
  }
};


  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Add New Project</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Client Info */}
            <h5 className="text-secondary mb-3">Client Details</h5>
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Client ID</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.displayClientId}
                  disabled
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">Client Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.clientName}
                  disabled
                />
              </div>
            </div>

            {/* Project Details */}
            <h5 className="text-secondary mb-3">Project Details</h5>
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Project Type</label>
                <select
                  name="projectName"
                  className="form-select"
                  value={formData.projectName}
                  onChange={handleChange}
                >
                  <option value="">-- Select Project Type --</option>
                  <option value="Web Development">Web Development</option>
                  <option value="Mobile App Development">
                    Mobile App Development
                  </option>
                  <option value="Software Development">Software Development</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Digital Marketing">Digital Marketing</option>
                  <option value="Cloud Solutions">Cloud Solutions</option>
                  <option value="IT Consulting">IT Consulting</option>
                  <option value="AI/ML Projects">AI/ML Projects</option>
                  <option value="Hosting">Hosting</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Department</label>
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
            </div>

            <div className="row mb-4">
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

              <div className="col-md-6">
                <label className="form-label">Project Price</label>
                <input
                  type="number"
                  name="price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label fw-bold">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Categories */}
            <div className="mb-4">
              <label className="form-label fw-bold">Categories or Technology</label>
              <CreatableSelect
                isMulti
                options={categories}
                value={formData.projectCategory.map((cat) => ({ value: cat, label: cat }))}
                onChange={(newValue) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectCategory: newValue ? newValue.map((item) => item.value) : [],
                  }))
                }
                placeholder="Select or type categories..."
              />
            </div>

            {/* Notes */}
            <div className="mb-4">
              <label className="form-label fw-bold">Note</label>
              <input
                type="text"
                className="form-control"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            {/* Assign Members */}
            <h5 className="text-secondary mb-3">Assign Members</h5>
            <div className="mb-4">
              <Select
                isMulti
                options={employees.map((emp) => ({
                  value: emp._id,
                  label: emp.ename,
                }))}
                value={employees
                  .filter((emp) => formData.assign?.includes(emp._id))
                  .map((emp) => ({ value: emp._id, label: emp.ename }))}
                onChange={(selected) => {
                  setFormData((prev) => ({
                    ...prev,
                    assign: selected.map((s) => s.value),
                  }));
                }}
              />
            </div>

            {/* File Upload */}
            <div className="mb-4">
              <label className="form-label fw-bold">Upload File</label>
              <input
                type="file"
                className="form-control"
                name="addFile"
                onChange={handleFileChange}
              />
            </div>

            {/* Project Description */}
            <div className="mb-4">
              <label className="form-label fw-bold">
                Project Description (max 200 words)
              </label>
              <textarea
                className="form-control"
                name="projectDescription"
                rows="4"
                maxLength="1200"
                value={formData.projectDescription}
                onChange={handleChange}
                required
              />
              <span className="badge bg-secondary mt-2">
                {formData.projectDescription.split(" ").filter(Boolean).length}/200 words
              </span>
            </div>

            <button type="submit" className="btn btn-success w-100">
              Save Project 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AddProject;
