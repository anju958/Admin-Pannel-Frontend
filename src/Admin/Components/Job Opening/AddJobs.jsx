import React, { useState } from 'react';
import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AddJobs() {
  const navigate = useNavigate()
  const [departments, setDepartments] = useState([]);    
  const [designations, setDesignations] = useState([]); 
  const [formData, setFormData] = useState({
    deptName: '',
    designation: '',
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
    axios.get('http://localhost:5000/api/getDepartmentNamee')
      .then(res => setDepartments(res.data || []))
      .catch(err => console.error(err));
  }, []);

  const handleDeptChange = async (e) => {
    const deptName = e.target.value;
    setFormData(prev => ({ ...prev, deptName, designation: '' }));
    setDesignations([]);

    if (!deptName) return;

    try {
      const res = await axios.get('http://localhost:5000/api/getDesignation', { params: { deptName } }); 
      setDesignations(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { deptName, designation, no_of_Opening, mini_salary,  max_salary, skills, job_des, job_type, opend_Date, close_date } = formData;

    if (!deptName || !designation || !no_of_Opening|| !mini_salary || !max_salary || !skills || !job_des || !job_type || !opend_Date || !close_date) {
      alert('All fields are required');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/addJob', formData, {
      });

      console.log('Form submitted:', res.data);
      alert('Job Added Successfully');

      setFormData({
        deptName: '',
        designation: '',
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
    <form className="form p-3" onSubmit={handleSubmit}>
      <h3 className="text-center">Add Vacancy</h3>

      <div className="form-input m-3">
        <label className="form-label">Department</label>
        <select
          className="form-select"
          name="deptName"
          value={formData.deptName}
          onChange={handleDeptChange}
        >
          <option value="">Select Department</option>
          {departments.map(d => (
            <option key={d.deptId} value={d.deptName}>{d.deptName}</option>
          ))}
        </select>
      </div>

      <div className="form-input m-3">
        <label className="form-label">Designation</label>
        <select
          className="form-select"
          name="designation"
          value={formData.designation}
          onChange={handleChange}
          disabled={!designations.length}
        >
          <option value="">{designations.length ? 'Select Designation' : 'Select a department first'}</option>
          {designations.map((title, i) => (
            <option key={i} value={title}>{title}</option>
          ))}
        </select>
      </div>
      <div className="form-input m-3">
        <input
          type="text"
          className="form-control"
          name="no_of_Opening"
          placeholder="Enter Number of Opening"
          value={formData.no_of_Opening}
          onChange={handleChange}
        />
      </div>
      <div className="form-input m-3">
        <input
          type="number"
          className="form-control"
          name="mini_salary"
          placeholder="Enter Minimum Salary"
          value={formData.mini_salary}
          onChange={handleChange}
        />
      </div>

      <div className="form-input m-3">
        <input
          type="number"
          className="form-control"
          name="max_salary"
          placeholder="Enter Maximum Salary"
          value={formData.max_salary}
          onChange={handleChange}
        />
      </div>

      <div className="form-input m-3">
        <input
          type="text"
          className="form-control"
          name="skills"
          placeholder="Skills"
          value={formData.skills}
          onChange={handleChange}
        />
      </div>

      <div className="form-input m-3">
        <label htmlFor="jobDescription" className="form-label">Job Description</label>
        <textarea
          className="form-control"
          id="jobDescription"
          rows="3"
          name="job_des"
          placeholder="Enter job description"
          value={formData.job_des}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="form-input mb-3 p-3">
        Job Type
        <select
          className="form-select"
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

      <div className="form-input m-3">
        Opening Date
        <input
          type="date"
          className="form-control"
          name="opend_Date"
          value={formData.opend_Date}
          onChange={handleChange}
        />
      </div>

      <div className="form-input m-3">
        Last Date
        <input
          type="date"
          className="form-control"
          name="close_date"
          value={formData.close_date}
          onChange={handleChange}
        />
      </div>

      <div className="form-input m-3">
        <button type="submit" className="btn bg-dark-subtle w-100 rounded-pill fw-bold">
          Add Job
        </button>
      </div>
    </form>
  );
}

export default AddJobs;
