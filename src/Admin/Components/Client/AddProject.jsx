import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useParams } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import Select from "react-select";
import { API_URL } from "../../../config";

import { useNavigate } from "react-router-dom";

function AddProject() {
  const { clientId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const clientData = location.state?.client;

  const [formData, setFormData] = useState({
    projectName: "",
    projectType: "",
    projectTypeOther: "",
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

  const [errors, setErrors] = useState({});

  const [categories, setCategories] = useState([
    { value: "Laravel", label: "Laravel" },
    { value: "Vuejs", label: "Vuejs" },
    { value: "React", label: "React" },
    { value: "Zend", label: "Zend" },
    { value: "CakePhp", label: "CakePhp" },
  ]);

  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);

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
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error on value change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleProjectTypeChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      projectType: e.target.value,
      projectTypeOther: "",
    }));
    setErrors((prev) => ({ ...prev, projectType: "" }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      addFile: e.target.files[0],
    }));
  };

  // Validate Dates
  const validateDates = () => {
    const newErrors = {};
    if (formData.startDate) {
      if (isNaN(Date.parse(formData.startDate))) {
        newErrors.startDate = "Start Date is invalid";
      }
    }
    if (formData.endDate) {
      if (isNaN(Date.parse(formData.endDate))) {
        newErrors.endDate = "End Date is invalid";
      }
    }
    if (
      formData.startDate &&
      formData.endDate &&
      Date.parse(formData.startDate) > Date.parse(formData.endDate)
    ) {
      newErrors.endDate = "End Date cannot be before Start Date";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  // Validate required fields including projectName and projectType
  const validateRequiredFields = () => {
    const newErrors = {};
    if (!formData.projectName.trim()) {
      newErrors.projectName = "Project Name is required";
    }
    if (!formData.projectType) {
      newErrors.projectType = "Project Type is required";
    }
    if (formData.projectType === "Other" && !formData.projectTypeOther.trim()) {
      newErrors.projectTypeOther = "Please specify project type";
    }
    setErrors((prev) => ({ ...prev, ...newErrors }));
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const areDatesValid = validateDates();
    const areRequiredFieldsValid = validateRequiredFields();
    if (!areDatesValid || !areRequiredFieldsValid) {
      alert("Please fix the errors before submitting");
      return;
    }

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
      if (formData.projectType === "Other" && formData.projectTypeOther) {
        data.set("projectType", formData.projectTypeOther);
      }
      await axios.post(`${API_URL}/api/addProject`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Project added successfully!");
      setFormData({
        projectName: "",
        projectType: "",
        projectTypeOther: "",
        department: "",
        service: "",
        startDate: "",
        endDate: "",
        projectCategory: [],
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
      setErrors({});
    } catch (err) {
      console.error("Error adding project:", err.response?.data || err.message);
    }
  };

  return (
    <div className="container mt-4">
       <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
      <div className="card shadow-lg border-0">
        <div className="d-flex justify-content-between mt-3"> 
        </div>
        <div className="card-header bg-primary text-white text-center">
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

            {/* Project Name */}
            <div className="mb-4">
              <label className="form-label">Project Name *</label>
              <input
                type="text"
                name="projectName"
                className={`form-control ${errors.projectName ? "is-invalid" : ""}`}
                value={formData.projectName}
                onChange={handleChange}
                required
              />
              {errors.projectName && (
                <div className="text-danger small">{errors.projectName}</div>
              )}
            </div>

            {/* Project Type */}
            <h5 className="text-secondary mb-3">Project Details</h5>
            <div className="row mb-4">
              <div className="col-md-6">
                <label className="form-label">Project Type *</label>
                <select
                  name="projectType"
                  className={`form-select ${errors.projectType ? "is-invalid" : ""}`}
                  value={formData.projectType}
                  onChange={handleProjectTypeChange}
                  required
                >
                  <option value="">-- Select Project Type --</option>
                  <option value="One-time Project">One-time Project</option>
                  <option value="Recurring Project">Recurring Project</option>
                  <option value="Dedicated Resource">Dedicated Resource</option>
                  <option value="Time & Material">Time & Material</option>
                  <option value="Fixed Price">Fixed Price</option>
                  <option value="Maintenance & Support">Maintenance & Support</option>
                  <option value="Other">Other</option>
                </select>
                {formData.projectType === "Other" && (
                  <input
                    type="text"
                    name="projectTypeOther"
                    className={`form-control mt-2 ${errors.projectTypeOther ? "is-invalid" : ""
                      }`}
                    placeholder="Please specify"
                    value={formData.projectTypeOther}
                    onChange={handleChange}
                    required
                  />
                )}
                {errors.projectType && (
                  <div className="text-danger small mt-1">{errors.projectType}</div>
                )}
                {errors.projectTypeOther && (
                  <div className="text-danger small mt-1">{errors.projectTypeOther}</div>
                )}
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
                  className={`form-control ${errors.startDate ? "is-invalid" : ""}`}
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                />
                {errors.startDate && (
                  <div className="text-danger small">{errors.startDate}</div>
                )}
              </div>
              <div className="col-md-6">
                <label className="form-label fw-bold">End Date</label>
                <input
                  type="date"
                  className={`form-control ${errors.endDate ? "is-invalid" : ""}`}
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                />
                {errors.endDate && (
                  <div className="text-danger small">{errors.endDate}</div>
                )}
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
