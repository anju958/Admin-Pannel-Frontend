

import axios from 'axios'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { API_URL } from "../../../config";

function AddServices() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    deptId: '',
    serviceName: '',
    servicePrice: ''
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { deptId, serviceName, servicePrice } = formData;

    if (!deptId || !serviceName || !servicePrice) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await axios.post(`${API_URL}/api/addService`, formData);
      alert(res.data.message || "Service added successfully");

      setFormData({ deptId: '', serviceName: '', servicePrice: '' });
      navigate('/admin/service');
    } catch (error) {
      console.error("Error submitting form:", error.response ? error.response.data : error.message);
      alert("Failed to submit form");
    }
  };

  return (
    <div className="container py-5 d-flex justify-content-center" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="col-lg-6 col-md-8">
        <div className="card shadow-lg border-0 rounded-4">
          {/* Header */}
          <div
            className="card-header text-white text-center py-3 rounded-top-4"
            style={{ background: "linear-gradient(90deg, #1f3b98, #3f65d6)" }}
          >
            <h3 className="mb-0 fw-bold">➕ Add New Service</h3>
          </div>

          {/* Body */}
          <div className="card-body p-4">
            <form onSubmit={handleSubmit}>
              {/* Service Name */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Service Name</label>
                <input
                  type="text"
                  className="form-control rounded-3 shadow-sm"
                  value={formData.serviceName}
                  onChange={handleChange}
                  name="serviceName"
                  placeholder="Enter service name"
                  required
                />
              </div>

              {/* Service Price */}
              <div className="mb-3">
                <label className="form-label fw-semibold">Service Price (₹)</label>
                <input
                  type="number"
                  className="form-control rounded-3 shadow-sm"
                  value={formData.servicePrice}
                  onChange={handleChange}
                  name="servicePrice"
                  placeholder="Enter service price"
                  required
                />
              </div>

              {/* Department */}
              <div className="mb-4">
                <label className="form-label fw-semibold">Select Department</label>
                <select
                  className="form-select rounded-3 shadow-sm"
                  name="deptId"
                  value={formData.deptId}
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

              {/* Submit Button */}
              <button
                type="submit"
                className="btn w-100 fw-bold rounded-pill py-2"
                style={{
                  background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                  color: "white",
                  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)"
                }}
              >
                ✅ Add Service
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddServices;
