
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const ProjectList = () => {
    const [projects, setProjects] = useState([]);
    const navigate = useNavigate();

    // Fetch all projects
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await axios.get("http://localhost:5000/api/getProjects");
                setProjects(res.data);
            } catch (err) {
                console.error("Error fetching projects:", err);
            }
        };
        fetchProjects();
    }, []);

    // Delete project
  

    const handleDelete = async (projectId, projectName) => {
        const confirmDelete = window.confirm(
            `Are you sure you want to delete project "${projectName}"?`
        );
        if (!confirmDelete) return;

        try {
            await axios.delete(`http://localhost:5000/api/deleteProjectById/${projectId}`);
            alert("Project deleted successfully!");
            setProjects(projects.filter((proj) => proj._id !== projectId));
        } catch (err) {
            console.error("Delete failed:", err);
            alert("Failed to delete project");
        }
    };

    const handleView = (id) => {
        navigate(`/admin/getAllprojects/${id}`);
    };

    return (
        <div className="container mt-4">
            <h2 className="text-center mb-4">📋 All Projects</h2>
            <div className="table-responsive shadow-lg rounded">
                <table className="table table-striped table-hover align-middle text-center">
                    <thead className="table-dark sticky-top">
                        <tr>
                            <th>Project ID</th>
                            <th>Project Name</th>
                            <th>Client Name</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Category</th>
                            <th>Added Member</th>
                            <th>Budget</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.map((project) => (
                            <tr key={project._id}>
                                <td><span className="badge bg-secondary">{project.projectId}</span></td>
                                <td className="fw-bold">{project.projectName}</td>
                                <td>{project.clientId?.leadName || "N/A"}</td>
                                <td>{new Date(project.startDate).toLocaleDateString()}</td>
                                <td>{new Date(project.endDate).toLocaleDateString()}</td>
                                <td>
                                    <span className="badge bg-info text-dark">
                                         {project.projectCategory && project.projectCategory.length > 0
                                            ? (() => {
                                                try {
                                                    const parsed = JSON.parse(project.projectCategory[0]);
                                                    return Array.isArray(parsed) ? parsed.join(", ") : parsed;
                                                } catch (e) {
                                                    // If JSON.parse fails, fallback to original string
                                                    return project.projectCategory[0];
                                                }
                                            })()
                                            : "N/A"}
                                    </span>
                                </td>
                                <td>
                                    {project.addMember && project.addMember.length > 0 ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            {project.addMember.slice(0, 4).map((emp, i) => (
                                                <div
                                                    key={emp._id || i}
                                                    className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center border border-white"
                                                    style={{
                                                        width: "35px",
                                                        height: "35px",
                                                        fontSize: "14px",
                                                        fontWeight: "bold",
                                                        marginLeft: i === 0 ? "0px" : "-10px",
                                                        zIndex: project.addMember.length - i,
                                                    }}
                                                    title={emp.ename || "Unknown"}
                                                >
                                                    {emp.ename ? emp.ename.charAt(0).toUpperCase() : "?"}
                                                </div>
                                            ))}
                                            {project.addMember.length > 4 && (
                                                <div
                                                    className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center border border-white"
                                                    style={{
                                                        width: "35px",
                                                        height: "35px",
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        marginLeft: "-10px",
                                                    }}
                                                >
                                                    +{project.addMember.length - 4}
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <span className="text-muted">Not Assigned</span>
                                    )}
                                </td>
                                <td><span className="badge bg-success">₹ {project.price?.toLocaleString()}</span></td>
                                <td>
                                    <button className="btn btn-info me-2" onClick={() => handleView(project._id)}>View</button>
                                    <button className="btn btn-danger" onClick={() => handleDelete(project._id, project.projectName)}>
                                        <i className="bi bi-trash"></i> Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ProjectList;
