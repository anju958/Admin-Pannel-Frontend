
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function ProposalList() {
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();

  // Fetch proposals from backend
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getAllProposal");
        setProposals(response.data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchProposals(proposals);
  }, []);

  console.log(proposals)
  // Delete a proposal
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      try {
        await axios.delete(`http://localhost:5000/api/proposals/${id}`);
        setProposals(proposals.filter((p) => p._id !== id));
      } catch (error) {
        console.error("Error deleting proposal:", error);
      }
    }
  };

  // Navigate to EditProposal page
  const handleEditClick = (proposal) => {
    navigate(`/admin/updateProposal/${proposal._id}`);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📜 Proposal List</h2>
      </div>

      <table className="table table-striped table-bordered shadow-sm" style={{ width: "1600px" }}>
        <thead className="table-dark">
          <tr>
            <th>ID</th>
            <th>Client</th>
            <th>Title</th>
            <th>Services</th>
            <th>Description</th>
            <th>Price</th>
            <th>Terms</th>
            <th>Status</th>
            <th>Enrollment Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {proposals.length > 0 ? (
            proposals.map((proposal, index) => (
              <tr key={proposal._id}>
                <td>{index + 1}</td>
                <td>{proposal.clientId?.leadName || "N/A"}</td>
                <td>{proposal.title}</td>
                <td>
                  {proposal.services && proposal.services.length > 0
                    ? proposal.services.map(s => s.name || s.serviceName).join(", ")
                    : "—"}
                </td>
                <td>{proposal.description}</td>
                <td>{proposal.price}</td>
                <td>{proposal.terms}</td>
                <td>
                  <span
                    className={`badge ${
                      proposal.status === "Approved"
                        ? "bg-success"
                        : proposal.status === "Pending"
                        ? "bg-warning text-dark"
                        : "bg-danger"
                    }`}
                  >
                    {proposal.status}
                  </span>
                </td>
                <td>{new Date(proposal.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-warning me-2"
                    onClick={() => handleEditClick(proposal)}
                  >
                    ✏️ Edit & Send
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(proposal._id)}
                  >
                    🗑️ Delete
                  </button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10" className="text-center text-muted">
                No proposals found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default ProposalList;
