import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation, Link } from "react-router-dom";
import { API_URL } from "../../../config";


function ViewProjects() {
    const location = useLocation();
    const client = location.state?.client;
    const clientId = client?._id;
    const [projects, setProjects] = useState([]);

    useEffect(() => {
        if (!clientId) return;
        axios.get(`${API_URL}/api/getProjectbyClient/${clientId}`)
            .then(res => setProjects(res.data))
            .catch(err => console.error("Error fetching projects:", err));
    }, [clientId]);
    console.log(projects)
    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">Projects List</h2>
           <h5 className="text-muted">Client: {client?.leadName || "Unknown"}</h5>
            <div className="card p-3 shadow-lg">
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Project Name</th>
                           
                            <th>Department</th>
                            <th>Service</th>
                            <th>Budget</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((proj, index) => (
                                <tr key={proj._id}>
                                    <td>{index + 1}</td>
                                    <td>{proj.projectName}</td>
                                   
                                   <td>{proj.department?.deptName}</td>
                                  <td>{proj.service?.serviceName}</td>
                                    <td>₹{proj.price}</td>
                                    <td>{new Date(proj.startDate).toLocaleDateString()}</td>
                                    <td>{new Date(proj.endDate).toLocaleDateString()}</td>
                                    <td>
                                        <Link to={`/admin/project/${clientId}/${proj._id}`} className="btn btn-sm btn-primary">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" className="text-center">No projects found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default ViewProjects;
