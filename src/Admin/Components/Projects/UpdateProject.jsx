
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Select from "react-select";

import { API_URL } from "../../../config";

const UpdateProject = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState({
    projectName: "",
    department: "",
    service: "",
    price: "",
    startDate: "",
    endDate: "",
    projectCategory: [],
    notes: "",
    projectDescription: "",
    addMember: []
  });

  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch project & departments on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const projectRes = await axios.get(
          `${API_URL}/api/getprojectByPorjectId/${id}`
        );
        const projectData = projectRes.data;

        setProject({
          projectName: projectData.projectName,
          department: projectData.department?._id || "",
          service: projectData.service?._id || "",
          price: projectData.price || "",
          startDate: projectData.startDate?.slice(0, 10) || "",
          endDate: projectData.endDate?.slice(0, 10) || "",
          projectCategory: projectData.projectCategory || [],
          notes: projectData.notes || "",
          projectDescription: projectData.projectDescription || "",
          addMember: projectData.addMember
            ? projectData.addMember.map((m) => ({ value: m._id, label: m.ename }))
            : []
        });

        const deptRes = await axios.get(`${API_URL}/api/getDepartment`);
        setDepartments(deptRes.data || []);
      } catch (err) {
        console.error("Error fetching project or departments:", err);
      }
    };

    fetchData();
  }, [id]);

  // Fetch services & employees when department is set/changed
  useEffect(() => {
    if (!project.department) {
      setServices([]);
      setEmployees([]);
      return;
    }

    const fetchDeptData = async () => {
      try {
        const [serviceRes, empRes] = await Promise.all([
          axios.get(`${API_URL}/api/getServicebyDepartment/${project.department}`),
          axios.get(`${API_URL}/api/getEmployeeByDepartment/${project.department}`)
        ]);

        setServices(serviceRes.data || []);
        setEmployees(
          empRes.data.map((emp) => ({ value: emp._id, label: emp.ename }))
        );

        setLoading(false); // loading ends after services/employees fetched
      } catch (err) {
        console.error("Error fetching services/employees:", err);
        setLoading(false);
      }
    };

    fetchDeptData();
  }, [project.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProject({ ...project, [name]: value });
  };

  const handleCategoryChange = (e) => {
    setProject({ ...project, projectCategory: e.target.value.split(",") });
  };

  const handleMemberChange = (selectedOptions) => {
    setProject({ ...project, addMember: selectedOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`${API_URL}/api/updateProject/${id}`, {
        ...project,
        addMember: project.addMember.map((m) => m.value) // send only IDs
      });
      alert("Project updated successfully!");
      navigate(`/admin/getAllprojects/${id}`);
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update project");
    }
  };

  if (loading) return <p className="text-center mt-5">Loading project...</p>;

  return (
    <div className="container mt-4">
      <div className="card shadow-lg border-0">
        <div className="card-header bg-primary text-white">
          <h3 className="mb-0">Update Project</h3>
        </div>
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            {/* Project Name */}
            <div className="mb-3">
              <label className="form-label">Project Name</label>
              <input
                type="text"
                className="form-control"
                name="projectName"
                value={project.projectName}
                onChange={handleChange}
                required
              />
            </div>

            {/* Department & Service */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Department</label>
                <select
                  className="form-select"
                  name="department"
                  value={project.department}
                  onChange={handleChange}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept._id} value={dept._id}>
                      {dept.deptName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">Service</label>
                <select
                  className="form-select"
                  name="service"
                  value={project.service}
                  onChange={handleChange}
                >
                  <option value="">Select Service</option>
                  {services.map((srv) => (
                    <option key={srv._id} value={srv._id}>
                      {srv.serviceName}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Dates */}
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Start Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="startDate"
                  value={project.startDate}
                  onChange={handleChange}
                />
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">End Date</label>
                <input
                  type="date"
                  className="form-control"
                  name="endDate"
                  value={project.endDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Category */}
            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                className="form-control"
                value={project.projectCategory.join(",")}
                onChange={handleCategoryChange}
                placeholder="Comma separated (e.g. React,Node)"
              />
            </div>

            {/* Price */}
            <div className="mb-3">
              <label className="form-label">Budget (Price)</label>
              <input
                type="number"
                className="form-control"
                name="price"
                value={project.price}
                onChange={handleChange}
              />
            </div>

            {/* Members */}
            <div className="mb-3">
              <label className="form-label">Assign Members</label>
              <Select
                isMulti
                options={employees}
                value={project.addMember}
                onChange={handleMemberChange}
              />
            </div>

            {/* Notes */}
            <div className="mb-3">
              <label className="form-label">Notes</label>
              <textarea
                className="form-control"
                name="notes"
                value={project.notes}
                onChange={handleChange}
              />
            </div>

            {/* Description */}
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                name="projectDescription"
                value={project.projectDescription}
                onChange={handleChange}
              />
            </div>

            {/* Actions */}
            <div className="text-end">
              <button type="submit" className="btn btn-success">
                Save Changes
              </button>
              <button
                type="button"
                className="btn btn-secondary ms-2"
                onClick={() => navigate(`/admin/getAllprojects/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateProject;
