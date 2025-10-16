import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function ProposalList() {
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();

  // Fetch proposals from backend
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllProposal`);
        setProposals(response.data);
      } catch (error) {
        console.error("Error fetching proposals:", error);
      }
    };
    fetchProposals(); // Corrected: No argument
  }, []);

  console.log(proposals)
  // Approve a proposal
  const handleApprove = async (id) => {
    try {
     await axios.patch(`${API_URL}/api/approvalproposal/${id}`, { status: "Accepted" });
      setProposals(proposals.map((p) =>
        p._id === id ? { ...p, status: "Accepted" } : p
      ));
    } catch (error) {
      console.error("Error approving proposal:", error);
    }
  };

  // Delete a proposal
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this proposal?")) {
      try {
        await axios.delete(`${API_URL}/api/DeleteProposal/${id}`);
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

  // Status badge color mapping
  const statusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "bg-success";
      case "Sent":
        return "bg-warning text-dark";
      case "Rejected":
        return "bg-danger";
      case "Draft":
        return "bg-secondary";
      default:
        return "bg-light text-dark";
    }
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
                <td>
                  {proposal.services && proposal.services.length > 0
                    ? proposal.services.reduce((sum, s) => sum + (s.price || 0), 0)
                    : 0}  
                </td>

                <td>{proposal.terms}</td>
                <td>
                  <span className={`badge ${statusClass(proposal.status)}`}>
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
                    className="btn btn-sm btn-success me-2"
                    disabled={proposal.status === "Accepted" || proposal.status === "Rejected"}
                    onClick={() => handleApprove(proposal._id)}
                  >
                    ✅ Approve
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
