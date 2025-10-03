
import React, { useState } from "react";
import axios from "axios";

const AssignTask = () => {
  const [formData, setFormData] = useState({
    projectId: "",
    title: "",
    description: "",
    category: "",
    priority: "Medium",
    deadline: "",
    estimatedHours: "",
    assignedTo: [],
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/tasks", formData); // Backend API
      alert("Task Assigned Successfully");
    } catch (err) {
      console.error(err);
      alert("Error assigning task");
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4">Assign Task</h3>
      <div className="card shadow-sm p-4">
        <form onSubmit={handleAssign}>
          {/* Task Title */}
          <div className="mb-3">
            <label className="form-label">Task Title</label>
            <input type="text" className="form-control" name="title"
              value={formData.title} onChange={handleChange} required />
          </div>

          {/* Description */}
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea className="form-control" rows="3" name="description"
              value={formData.description} onChange={handleChange}></textarea>
          </div>

          {/* Category / Priority */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" name="category"
                value={formData.category} onChange={handleChange}>
                <option value="">Choose...</option>
                <option value="Website Development">Website Development</option>
                <option value="Digital Marketing">Digital Marketing</option>
                <option value="Hosting">Hosting</option>
              </select>
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Priority</label>
              <select className="form-select" name="priority"
                value={formData.priority} onChange={handleChange}>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
              </select>
            </div>
          </div>

          {/* Deadline / Hours */}
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Deadline</label>
              <input type="date" className="form-control" name="deadline"
                value={formData.deadline} onChange={handleChange} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Estimated Hours</label>
              <input type="number" className="form-control" name="estimatedHours"
                value={formData.estimatedHours} onChange={handleChange} />
            </div>
          </div>

          {/* Assign Employees */}
          <div className="mb-3">
            <label className="form-label">Assign To</label>
            <select multiple className="form-select" name="assignedTo"
              onChange={(e) => {
                const selected = Array.from(e.target.selectedOptions, opt => opt.value);
                setFormData({ ...formData, assignedTo: selected });
              }}>
              <option value="emp1">John - Developer</option>
              <option value="emp2">Priya - Designer</option>
              <option value="emp3">Amit - SEO</option>
            </select>
          </div>

          <div className="d-flex justify-content-end gap-2">
            <button type="reset" className="btn btn-secondary">Reset</button>
            <button type="submit" className="btn btn-primary">Assign Task</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignTask;
