import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URL } from "../../../config";

function Opening() {
  const [Jobs, setJobs] = useState([]);
  console.log(Jobs);

  useEffect(() => {
    axios.get(`${API_URL}/api/get_Jobs`)
      .then(result => {
        if (result.data) {
          setJobs(result.data);
        } else {
          alert(result.data.Error);
        }
      });
  }, []);

  const handleUpdate = async (jobId) => {
    try {
      const res = await axios.put(`${API_URL}/api/updateVacancy/${jobId}`, {
        count: 1
      });
      // setJobs(prev =>
      //   prev.map(job => job.jobId === jobId ? res.data.job : job)
      // );
     setJobs(prev =>
  prev.map(job =>
    job.jobId === jobId
      ? {
          ...job,
          selected_emp: res.data.job.selected_emp,
          availableVacancies: res.data.job.availableVacancies
        }
      : job
  )


);
    } catch (err) {
      if (err.response && err.response.data.message) {
        alert(err.response.data.message);
      } else {
        alert("Failed to update vacancy");
      }
    }
  };
const deleteJob = async (jobId) => {
  if (window.confirm("Are you sure you want to delete this job?")) {
    try {
      await axios.delete(`${API_URL}/api/deleteJob/${jobId}`);
      alert("Job deleted successfully");

      // remove from state
      setJobs(prev => prev.filter(job => job._id !== jobId));
    } catch (error) {
      console.error(error);
      alert("Failed to delete job");
    }
  }
};
  return (
    <div className="container-fluid py-5" style={{ background: "#f9faff" }}>
      <div className="row">
        <div className="col-md-12">

          {/* Heading Section */}
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#1f3b98" }}>
              🚀 Current Job Openings
            </h2>
            <p className="text-muted">
              Join Premier Webtech – Shape your future with us.
            </p>
          </div>

          {/* Add Vacancy Button */}
          <div className="d-flex justify-content-end mb-3">
            <Link
              to="/admin/addJobs"
              className="btn px-4 py-2 fw-bold rounded-pill"
              style={{
                background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                color: "white",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
              }}
            >
              + Add Vacancy
            </Link>
          </div>

          {/* Job Table */}
          <div className="table-responsive shadow-lg rounded">
            <table className="table table-hover align-middle">
              <thead style={{ background: "#1f3b98", color: "white" }}>
                <tr>
                  <th>Job ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Min Salary</th>
                  <th>Max Salary</th>
                  <th>Skills</th>
                  <th>Description</th>
                  <th>Type</th>
                  <th>Posted</th>
                  <th>Close Date</th>
                  <th>Openings</th>
                  <th>Selected</th>
                  <th>Available</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {
                  Jobs.map(job => (
                    <tr key={job.jobId}>
                      <td className="fw-semibold">{job.jobId}</td>
                      <td>{job.department?.deptName}</td>
                      <td>{job.service?.serviceName}</td>
                      <td>₹{job.mini_salary}</td>
                      <td>₹{job.max_salary}</td>
                      <td className="skills">{job.skills}</td>
                      <td className="description">{job.job_des}</td>
                      <td>
                        <span className="badge bg-primary">
                          {job.job_type}
                        </span>
                      </td>
                      <td>{job.opend_Date}</td>
                      <td>{job.close_date}</td>
                      <td>{job.no_of_Opening}</td>
                      <td>{job.selected_emp}</td>
                      <td className={job.availableVacancies <= 0 ? "text-danger fw-bold" : "fw-bold"}>
                        {job.availableVacancies <= 0 ? 0 : job.availableVacancies}
                      </td>
                      <td>
                        <button
                          className="btn btn-sm fw-bold rounded-pill"
                          style={{
                            background: "linear-gradient(90deg,#28a745,#34d058)",
                            color: "white"
                          }}
                          onClick={() => handleUpdate(job.jobId)}
                          disabled={job.availableVacancies <= 0}
                        >
                          + Select
                        </button>
                        <button className="btn btn-sm fw-bold rounded-pill"
                          style={{
                            background: "linear-gradient(90deg,#28a745,#34d058)",
                            border: "none"
                          }}
                          onClick={() => deleteJob(job._id)}
                          >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Opening;
