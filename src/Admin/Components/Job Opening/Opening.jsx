import { Link } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import { formatDate } from "../../../utils/dateFormatter";
import { AuthContext } from "../../../Context/AuthContext";

// ✅ Permission helper functions
const canDo = (user, module, action) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.[action] === true;
};

const canViewPage = (user, module) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.view === true;
};

function Opening() {
  const [Jobs, setJobs] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    axios.get(`${API_URL}/api/get_Jobs`).then((result) => {
      if (result.data) {
        setJobs(result.data);
      }
    });
  }, []);

  // ✅ Page Access Control
  if (!canViewPage(user, "jobopenings")) {
    return (
      <div className="container text-center py-5">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view Job Openings.</p>
      </div>
    );
  }

  // ✅ Select (+1 selected employee)
  const handleUpdate = async (jobId) => {
    if (!canDo(user, "jobopenings", "edit"))
      return alert("You do not have permission to select employees.");

    try {
      const res = await axios.put(`${API_URL}/api/updateVacancy/${jobId}`, {
        count: 1,
      });

      setJobs((prev) =>
        prev.map((job) =>
          job.jobId === jobId
            ? {
                ...job,
                selected_emp: res.data.job.selected_emp,
                availableVacancies: res.data.job.availableVacancies,
              }
            : job
        )
      );
    } catch (err) {
      alert("Failed to update vacancy");
    }
  };

  // ✅ Delete Job
  const deleteJob = async (jobId) => {
    if (!canDo(user, "jobopenings", "delete"))
      return alert("You do not have permission to delete jobs.");

    if (window.confirm("Are you sure you want to delete this job?")) {
      try {
        await axios.delete(`${API_URL}/api/deleteJob/${jobId}`);
        setJobs((prev) => prev.filter((job) => job._id !== jobId));
        alert("Job deleted successfully");
      } catch (error) {
        alert("Failed to delete job");
      }
    }
  };

  return (
    <div className="container-fluid py-5" style={{ background: "#f9faff" }}>
      <div className="row">
        <div className="col-md-12">
          {/* Heading */}
          <div className="text-center mb-4">
            <h2 className="fw-bold" style={{ color: "#1f3b98" }}>
              🚀 Current Job Openings
            </h2>
            <p className="text-muted">
              Join Premier Webtech – Shape your future with us.
            </p>
          </div>

          {/* ✅ Add Vacancy (permission controlled) */}
          {canDo(user, "jobopenings", "add") && (
            <div className="d-flex justify-content-end mb-3">
              <Link
                to="/admin/addJobs"
                className="btn px-4 py-2 fw-bold rounded-pill"
                style={{
                  background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                  color: "white",
                }}
              >
                + Add Vacancy
              </Link>
            </div>
          )}

          {/* Table */}
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
                {Jobs.map((job) => (
                  <tr key={job.jobId}>
                    <td>{job.jobId}</td>
                    <td>{job.department?.deptName}</td>
                    <td>{job.service?.serviceName}</td>
                    <td>₹{job.mini_salary}</td>
                    <td>₹{job.max_salary}</td>
                    <td>{job.skills}</td>
                    <td>{job.job_des}</td>

                    <td>
                      <span className="badge bg-primary">{job.job_type}</span>
                    </td>

                    <td>{formatDate(job.opend_Date)}</td>
                    <td>{formatDate(job.close_date)}</td>

                    <td>{job.no_of_Opening}</td>
                    <td>{job.selected_emp}</td>

                    <td
                      className={
                        job.availableVacancies <= 0
                          ? "text-danger fw-bold"
                          : "fw-bold"
                      }
                    >
                      {job.availableVacancies <= 0
                        ? 0
                        : job.availableVacancies}
                    </td>

                    <td>
                      {/* ✅ Select (permission) */}
                      {canDo(user, "jobopenings", "edit") && (
                        <button
                          className="btn btn-sm text-white fw-bold rounded-pill me-2"
                          style={{
                            background:
                              "linear-gradient(90deg,#28a745,#34d058)",
                          }}
                          onClick={() => handleUpdate(job.jobId)}
                          disabled={job.availableVacancies <= 0}
                        >
                          + Select
                        </button>
                      )}

                      {/* ✅ Delete (permission) */}
                      {canDo(user, "jobopenings", "delete") && (
                        <button
                          className="btn btn-sm text-white fw-bold rounded-pill"
                          style={{
                            background:
                              "linear-gradient(90deg,#dc3545,#ff4d4d)",
                          }}
                          onClick={() => deleteJob(job._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Opening;
