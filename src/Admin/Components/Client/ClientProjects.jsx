import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

function ClientProjects({ clientId }) {
  const [client, setClient] = useState(null);
  const [projects, setProjects] = useState([]);

  useEffect(() => {

    axios
      .get(`${API_URL}/api/getClientLeadbyId/${clientId}`)
      .then((res) => setClient(res.data))
      .catch((err) => console.error("Error fetching client:", err));
    axios
      .get(`${API_URL}/api/getProjectByid/${clientId}`)
      .then((res) => setProjects(res.data))
      .catch((err) => console.error("Error fetching projects:", err));
  }, [clientId]);

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-3">Project Details</h2>

     
      {client && (
        <div className="card p-3 shadow-sm mb-4">
          <h5>Client Information</h5>
          <p><strong>Name:</strong> {client.clientName}</p>
          <p><strong>Email:</strong> {client.email}</p>
          <p><strong>Phone:</strong> {client.phone}</p>
        </div>
      )}

     
      <div className="card p-3 shadow-sm">
        <h5 className="mb-3">Projects</h5>
        {projects.length === 0 ? (
          <p>No projects found for this client.</p>
        ) : (
          projects.map((project) => (
            <div key={project._id} className="border rounded p-3 mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h6>{project.projectName}</h6>
                <span className="badge bg-warning text-dark">
                  {project.status || "Pending"}
                </span>
              </div>
              <p><strong>Department:</strong> {project.department}</p>
              <p><strong>Assigned:</strong> {project.assignedTo}</p>
              <p><strong>Start Date:</strong> {new Date(project.startDate).toLocaleDateString()}</p>
              <p><strong>End Date:</strong> {new Date(project.endDate).toLocaleDateString()}</p>
              <p><strong>Budget:</strong> ₹{project.budget}</p>
              <p><strong>Summary:</strong> {project.summary}</p>
              <p><strong>Description:</strong> {project.description}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ClientProjects;
