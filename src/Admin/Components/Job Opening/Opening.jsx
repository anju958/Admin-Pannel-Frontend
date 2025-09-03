import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react'
import axios from 'axios'


function Opening() {
    const [Jobs, setJobs] = useState([])
    console.log(Jobs)
    useEffect(() => {
        axios.get('http://localhost:5000/api/get_Jobs').
            then(result => {
                if (result.data) {
                    setJobs(result.data)
                }
                else {
                    alert(result.data.Error)
                }
            })

    }, [])
    const handleUpdate = async (jobId) => {
        try {
            const res = await axios.put(`http://localhost:5000/api/updateVacancy/${jobId}`, {
                count: 1
            });
            setJobs(prev =>
                prev.map(job => job.jobId === jobId ? res.data.job : job)
            );
        } catch (err) {
            if (err.response && err.response.data.message) {
                alert(err.response.data.message);
            } else {
                alert("Failed to update vacancy");
            }
        }
    };

    return (
        <>

            <div className='container-fluid'>
                <div className='row'>
                    <div className='col-md-12'>
                        <form>
                            <h3 className='text-center'>Job Vacancy</h3>
                            <div className='form-input m-3'>
                                <Link to="/admin/addJobs"
                                    type="submit"
                                    className="btn bg-dark-subtle  w-10 rounded-pill fw-bold">
                                    Add Vacancy
                                </Link>
                            </div>
                            <div className="container mt-4">
                                <h3 className="mb-4">Open Job Positions</h3>

                                <table className="table  table-bordered table-hover">
                                    <thead className="table-dark">
                                        <tr>
                                            <th>Job ID</th>
                                            <th>Department</th>
                                            <th>Designation</th>
                                            <th>Minimum Salary</th>
                                            <th>Maximum Salary</th>
                                            <th>Skils</th>
                                            <th>Job Description</th>
                                            <th>Job Type</th>
                                            <th>Posted Date</th>
                                            <th>Close Date</th>
                                            <th>Open NO. of Vacancy</th>
                                            <th>Select Empoyee</th>
                                            <th>Available Vacancies </th>
                                            <th>Update Employee</th>
                                        </tr>
                                    </thead>
                                    <tbody>

                                        {
                                            Jobs.map(job => (
                                                <tr>
                                                    <td>{job.jobId}</td>
                                                    <td>{job.deptName}</td>
                                                    <td>{job.designation}</td>
                                                    <td>{job.mini_salary}</td>
                                                    <td>{job.max_salary}</td>
                                                    <td>{job.skills}</td>
                                                    <td>{job.job_des}</td>
                                                    <td>{job.job_type}</td>
                                                    <td>{job.opend_Date}</td>
                                                    <td>{job.close_date}</td>
                                                    <td>{job.no_of_Opening}</td>
                                                    <td>{job.selected_emp}</td>
                                                    <td>{job.availableVacancies}</td>
                                                    <td>
                                                        <button
                                                            className="btn btn-success btn-sm"
                                                            onClick={() => handleUpdate(job.jobId)}
                                                        >
                                                            + Select Employee
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
        </>
    )
}

export default Opening