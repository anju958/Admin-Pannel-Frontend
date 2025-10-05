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
  });

  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [service, setService] = useState(null);
  const [employees, setEmployees] = useState([]);

  // Fetch clients on load
  useEffect(() => {
    const fetchClients = async () => {
      const res = await axios.get(`${API_URL}/api/getClientLead`);
      setClients(res.data);
    };
    fetchClients();
  }, []);

  // Fetch projects when client changes
  useEffect(() => {
    if (formData.clientId) {
      const fetchProjects = async () => {
        const res = await axios.get(
          `${API_URL}/api/getProjectbyClient/${formData.clientId}`
        );
        setProjects(res.data);
      };
      fetchProjects();
      setFormData((prev) => ({
        ...prev,
        projectId: "",
        serviceId: "",
        assignedTo: [],
      }));
      setService(null);
      setEmployees([]);
    }
  }, [formData.clientId]);

  // Fetch service & employees when project changes

  useEffect(() => {
    if (formData.projectId) {
      const fetchServiceAndEmployees = async () => {
        try {
          // Fetch service by project
          const serviceRes = await axios.get(
            `${API_URL}/api/getServices/${formData.projectId}`
          );
          const projectServices = serviceRes.data.services; // array
          const projectService = projectServices[0]; // first service
          setService(projectService);
          setFormData((prev) => ({
            ...prev,
            serviceId: projectService?._id || "",
            assignedTo: [],
          }));

          // Fetch employees
          const empRes = await axios.get(
            `${API_URL}/api/getEmployeeByProject/${formData.projectId}`
          );
          setEmployees(empRes.data.employees || []);
        } catch (err) {
          console.error(err);
          setService(null);
          setEmployees([]);
        }
      };
      fetchServiceAndEmployees();
    } else {
      setService(null);
      setEmployees([]);
      setFormData((prev) => ({ ...prev, serviceId: "", assignedTo: [] }));
    }
  }, [formData.projectId]);



  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };


  // Separate useEffect to fetch project details
  useEffect(() => {
    if (formData.projectId) {
      const fetchProjectDetails = async () => {
        try {
          const res = await axios.get(
            `${API_URL}/api/getProjectDetails/${formData.projectId}`
          );

          const { projectCategory, startDate, endDate } = res.data;

          // Parse category if stored as JSON string
          let categories = [];
          if (projectCategory && projectCategory.length > 0) {
            try {
              categories = JSON.parse(projectCategory[0]);
            } catch {
              categories = projectCategory;
            }
          }

          // Update formData with fetched details
          setFormData((prev) => ({
            ...prev,
            category: categories.join(", "), // you can display multiple categories
            startDate: startDate ? startDate.split("T")[0] : "",
            dueDate: endDate ? endDate.split("T")[0] : "",
          }));
        } catch (err) {
          console.error("Error fetching project details:", err);
        }
      };

      fetchProjectDetails();
    }
  }, [formData.projectId]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/api/addTask`, formData);
      alert("Task assigned successfully!");
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
      });
      setProjects([]);
      setService(null);
      setEmployees([]);
    } catch (err) {
      console.error(err);
      alert("Failed to assign task.");
    }
  };

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">Assign Task</h4>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="row mb-3">
              {/* Client */}
              <div className="col-md-4">
                <label className="form-label fw-bold">Client</label>
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

              {/* Project */}
              <div className="col-md-4">
                <label className="form-label fw-bold">Project</label>
                <select
                  className="form-select"
                  name="projectId"
                  value={formData.projectId}
                  onChange={handleChange}
                  required
                  disabled={!formData.clientId}
                >
                  <option value="">-- Select Project --</option>
                  {projects.map((p) => (
                    <option key={p._id} value={p._id}>
                      {p.projectName}
                    </option>
                  ))}
                </select>
              </div>

              {/* Service */}
              <div className="col-md-4">
                <label className="form-label fw-bold">Service</label>
                <Select
                  options={service ? [{ value: service._id, label: service.serviceName }] : []}
                  value={service ? { value: service._id, label: service.serviceName } : null}
                  onChange={(selected) =>
                    setFormData((prev) => ({ ...prev, serviceId: selected.value }))
                  }
                  isDisabled={!service}
                />
              </div>
            </div>

            {/* Task Info */}
            <div className="mb-3">
              <label className="form-label fw-bold">Task Title *</label>
              <input
                type="text"
                className="form-control"
                name="title"
                placeholder="Enter task title"
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
                className="form-control"
                name="category"
                value={formData.category}  // <-- shows fetched category
                onChange={handleChange}
              />
            </div>
          
            {/* Start Date */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Start Date *</label>
              <input
                type="date"
                className="form-control"
                name="startDate"
                value={formData.startDate}  // <-- shows fetched start date
                onChange={handleChange}
                required
              />
            </div>

            {/* Due Date */}
            <div className="col-md-6">
              <label className="form-label fw-bold">Due Date *</label>
              <input
                type="date"
                className="form-control"
                name="dueDate"
                value={formData.dueDate}  // <-- shows fetched end date
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Status</label>
              <select
                className="form-select"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            {/* Assign Employees */}
            <div className="mb-3">
              <label className="form-label fw-bold">Assign Employees</label>
              <Select
                isMulti
                options={employees.map((e) => ({
                  value: e._id,
                  label: e.ename,
                }))}
                value={employees
                  .filter((e) => formData.assignedTo.includes(e._id))
                  .map((e) => ({ value: e._id, label: e.ename }))}
                onChange={(selected) =>
                  setFormData((prev) => ({
                    ...prev,
                    assignedTo: selected.map((s) => s.value),
                  }))
                }
                isDisabled={!formData.projectId}
              />
            </div>

            <div className="mb-3">
              <label className="form-label fw-bold">Description</label>
              <textarea
                className="form-control"
                rows="4"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Enter task description"
              ></textarea>
            </div>

            <button type="submit" className="btn btn-success w-100">
              Assign Task 🚀
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TaskAssign;
