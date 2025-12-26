import React, { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { API_URL } from "../../../config";

function TaskAssign() {
  const [formData, setFormData] = useState({
    clientId: "",
    projectId: "",
    serviceId: "",
    assignedTo: [],
    title: "",
    category: "",
    startDate: "",
    dueDate: "",
    status: "Pending",
    description: "",
    priority: "Low",
  });

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [service, setService] = useState(null);
  const [employees, setEmployees] = useState([]);

  // ===========================
  // LOAD CLIENTS
  // ===========================
  useEffect(() => {
    axios
      .get(`${API_URL}/api/getClientLead`)
      .then((res) => setClients(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ===========================
  // WHEN CLIENT CHANGES → LOAD PROJECTS
  // ===========================
  useEffect(() => {
    if (!formData.clientId) return;

    const loadProjects = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/getProjectbyClient/${formData.clientId}`
        );

        setProjects(res.data);

        // reset dependent fields
        setFormData((prev) => ({
          ...prev,
          projectId: "",
          serviceId: "",
          assignedTo: [],
          category: "",
          startDate: "",
          dueDate: "",
        }));

        setService(null);
        setEmployees([]);
      } catch (err) {
        console.error(err);
      }
    };

    loadProjects();
  }, [formData.clientId]);

  // ===========================
  // WHEN PROJECT CHANGES → LOAD SERVICE + EMPLOYEES
  // ===========================
  useEffect(() => {
    if (!formData.projectId) return;

    const loadProjectRelatedData = async () => {
      try {
        // 1️⃣ Get service of project
        const serviceRes = await axios.get(
          `${API_URL}/api/getServices/${formData.projectId}`
        );

        const projectService = serviceRes.data.services?.[0] || null;
        setService(projectService);

        if (!projectService?._id) {
          setEmployees([]);
          return;
        }

        setFormData((prev) => ({
          ...prev,
          serviceId: projectService._id,
          assignedTo: [],
        }));

        // 2️⃣ Get employees by service
        const empRes = await axios.get(
          `${API_URL}/api/getEmployeesByService/${projectService._id}`
        );

        setEmployees(empRes.data.employees || []);
      } catch (err) {
        console.error("Error loading project data:", err);
      }
    };

    loadProjectRelatedData();
  }, [formData.projectId]);

  // ===========================
  // LOAD PROJECT DETAILS
  // ===========================
  useEffect(() => {
    if (!formData.projectId) return;

    const loadProjectDetails = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/getProjectDetails/${formData.projectId}`
        );

        const { projectCategory, startDate, endDate } = res.data;

        let categoryList = [];

        if (projectCategory?.length > 0) {
          try {
            categoryList = JSON.parse(projectCategory[0]);
          } catch {
            categoryList = projectCategory;
          }
        }

        setFormData((prev) => ({
          ...prev,
          category: categoryList.join(", "),
          startDate: startDate ? startDate.split("T")[0] : "",
          dueDate: endDate ? endDate.split("T")[0] : "",
        }));
      } catch (err) {
        console.error(err);
      }
    };

    loadProjectDetails();
  }, [formData.projectId]);

  // ===========================
  // HANDLERS
  // ===========================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/tasks/add`, formData);
      alert("Task Assigned Successfully!");

      setFormData({
        clientId: "",
        projectId: "",
        serviceId: "",
        assignedTo: [],
        title: "",
        category: "",
        startDate: "",
        dueDate: "",
        status: "Pending",
        description: "",
        priority: "Low",
      });

      setProjects([]);
      setEmployees([]);
      setService(null);
    } catch (err) {
      console.error(err);
      alert("Error assigning task");
    }
  };

  // ===========================
  // UI
  // ===========================
  return (
    <div className="container mt-4">
      <div className="card shadow-lg">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Assign Task</h4>
        </div>

        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Client / Project / Service */}
            <div className="row g-3 mb-3">
              <div className="col-md-4">
                <label className="form-label fw-bold">Client *</label>
                <select
                  className="form-select"
                  name="clientId"
                  value={formData.clientId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Client --</option>
                  {clients.map((c) => (
                    <option key={c._id} value={c._id}>
                      {c.leadName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Project *</label>
                <select
                  className="form-select"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-4">
                <label className="form-label fw-bold">Service</label>
                <input
                  type="text"
                  className="form-control"
                  value={service?.serviceName || ""}
                  disabled
                />
              </div>
            </div>

            {/* Task Title */}
            <div className="mb-3">
              <label className="form-label fw-bold">Task Title *</label>
              <input
                type="text"
                name="title"
                className="form-control"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label fw-bold">Category</label>
              <input
                type="text"
                name="category"
                className="form-control"
                value={formData.category}
                onChange={handleChange}
              />
            </div>

            {/* Dates */}
            <div className="row g-3 mb-3">
              <div className="col-md-6">
                <label className="form-label fw-bold">Start Date *</label>
                <input
                  type="date"
                  name="startDate"
                  className="form-control"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <label className="form-label fw-bold">Due Date *</label>
                <input
                  type="date"
                  name="dueDate"
                  className="form-control"
                  value={formData.dueDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Priority */}
            <div className="mb-3">
              <label className="form-label fw-bold">Priority</label>
              <select
                className="form-select"
                name="priority"
                value={formData.priority}
                onChange={handleChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            {/* Assign Employees */}
            <div className="mb-3">
              <label className="form-label fw-bold">Assign Employees *</label>
              <Select
                isMulti
                options={employees.map((emp) => ({
                  value: emp._id,
                  label: emp.ename || "Unnamed Employee",
                }))}
                value={employees
                  .filter((emp) =>
                    formData.assignedTo.includes(emp._id)
                  )
                  .map((emp) => ({
                    value: emp._id,
                    label: emp.ename || "Unnamed Employee",
                  }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    assignedTo: selected.map((s) => s.value),
                  }))
                }
                placeholder="Select employees"
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </div>

            <button className="btn btn-success w-100" type="submit">
              Assign Task 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskAssign;
