import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddJobs() {
  const navigate = useNavigate();
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [formData, setFormData] = useState({
    department: '',
    service: '',
    no_of_Opening: '',
    mini_salary: '',
    max_salary: '',
    skills: '',
    job_des: '',
    job_type: '',
    opend_Date: '',
    close_date: '',
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/getDepartment");
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
          `http://localhost:5000/api/getServicebyDepartment/${formData.department}`
        );
        setServices(res.data);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };
    fetchServices();
  }, [formData.department]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { department, service, no_of_Opening, mini_salary, max_salary, skills, job_des, job_type, opend_Date, close_date } = formData;

    if (!department || !service || !no_of_Opening || !mini_salary || !max_salary || !skills || !job_des || !job_type || !opend_Date || !close_date) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/addJob', formData);
      alert('Job Added Successfully');
      console.log('Form submitted:', res.data);

      setFormData({
        department: '',
        service: '',
        no_of_Opening: '',
        mini_salary: '',
        max_salary: '',
        skills: '',
        job_des: '',
        job_type: '',
        opend_Date: '',
        close_date: '',
      });
      navigate('/admin/jobopening');
    } catch (error) {
      console.error('Error submitting form:', error.response ? error.response.data : error.message);
      alert('Failed to submit form.');
    }
  };

  return (
    <div className="container py-5" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">
          <div className="card shadow-lg border-0 rounded-4">
            
            {/* Card Header */}
            <div 
              className="card-header text-white text-center py-4 rounded-top-4"
              style={{ background: "linear-gradient(90deg,#1f3b98,#3f65d6)" }}
            >
              <h3 className="mb-0 fw-bold">📋 Add New Job Vacancy</h3>
              <p className="mb-0 small">Fill in the details below to post a new job opportunity</p>
            </div>
            
            {/* Card Body */}
            <div className="card-body p-5">
              <form onSubmit={handleSubmit} className="row g-4">
                
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
                      <option key={dept._id} value={dept._id}>{dept.deptName}</option>
                    ))}
                  </select>
                </div>

                {/* Service */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Select Service</label>
                  <select
                    className="form-select rounded-pill"
                    name="service"
                    value={formData.service}
                    onChange={handleChange}
                  >
                    <option value="">-- Select Service --</option>
                    {services.map((srv) => (
                      <option key={srv._id} value={srv._id}>{srv.serviceName}</option>
                    ))}
                  </select>
                </div>

                {/* Openings */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Number of Openings</label>
                  <input
                    type="number"
                    className="form-control rounded-pill"
                    name="no_of_Opening"
                    placeholder="Enter number of openings"
                    value={formData.no_of_Opening}
                    onChange={handleChange}
                  />
                </div>

                {/* Salary */}
                <div className="col-md-3">
                  <label className="form-label fw-bold">Min Salary</label>
                  <input
                    type="number"
                    className="form-control rounded-pill"
                    name="mini_salary"
                    placeholder="Min salary"
                    value={formData.mini_salary}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-bold">Max Salary</label>
                  <input
                    type="number"
                    className="form-control rounded-pill"
                    name="max_salary"
                    placeholder="Max salary"
                    value={formData.max_salary}
                    onChange={handleChange}
                  />
                </div>

                {/* Skills */}
                <div className="col-md-12">
                  <label className="form-label fw-bold">Required Skills</label>
                  <input
                    type="text"
                    className="form-control rounded-pill"
                    name="skills"
                    placeholder="Enter skills"
                    value={formData.skills}
                    onChange={handleChange}
                  />
                </div>

                {/* Job Description */}
                <div className="col-md-12">
                  <label className="form-label fw-bold">Job Description</label>
                  <textarea
                    className="form-control rounded-4"
                    rows="4"
                    name="job_des"
                    placeholder="Enter job description"
                    value={formData.job_des}
                    onChange={handleChange}
                  ></textarea>
                </div>

                {/* Job Type */}
                <div className="col-md-6">
                  <label className="form-label fw-bold">Job Type</label>
                  <select
                    className="form-select rounded-pill"
                    name="job_type"
                    value={formData.job_type}
                    onChange={handleChange}
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full Time">Full Time</option>
                    <option value="Part Time">Part Time</option>
                    <option value="Work from Home">Work From Home</option>
                    <option value="Work from Office">Work From Office</option>
                  </select>
                </div>

                {/* Dates */}
                <div className="col-md-3">
                  <label className="form-label fw-bold">Opening Date</label>
                  <input
                    type="date"
                    className="form-control rounded-pill"
                    name="opend_Date"
                    value={formData.opend_Date}
                    onChange={handleChange}
                  />
                </div>

                <div className="col-md-3">
                  <label className="form-label fw-bold">Last Date</label>
                  <input
                    type="date"
                    className="form-control rounded-pill"
                    name="close_date"
                    value={formData.close_date}
                    onChange={handleChange}
                  />
                </div>

                {/* Submit */}
                <div className="col-12">
                  <button 
                    type="submit" 
                    className="btn w-100 rounded-pill fw-bold py-2"
                    style={{ 
                      background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                      color: "white",
                      boxShadow: "0px 4px 12px rgba(0,0,0,0.15)"
                    }}
                  >
                    ➕ Add Job
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddJobs;
