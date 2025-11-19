import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// ✅ Permissions helper
const canDo = (user, module, action) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.[action] === true;
};

const canViewPage = (user, module) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.view === true;
};

function ProposalList() {
  const [proposals, setProposals] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // ✅ Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getAllProposal`);
        setProposals(res.data);
      } catch (err) {
        console.error("Error fetching proposals:", err);
      }
    };
    fetchProposals();
  }, []);

  // ✅ Approve proposal
  const handleApprove = async (id) => {
    if (!canDo(user, "proposals", "edit"))
      return alert("You do not have permission to approve proposals.");

    try {
      await axios.patch(`${API_URL}/api/approvalproposal/${id}`, {
        status: "Accepted",
      });

      setProposals((prev) =>
        prev.map((p) => (p._id === id ? { ...p, status: "Accepted" } : p))
      );
    } catch (error) {
      console.error("Error approving proposal:", error);
    }
  };

  // ✅ Delete proposal
  const handleDelete = async (id) => {
    if (!canDo(user, "proposals", "delete"))
      return alert("You do not have permission to delete proposals.");

    if (!window.confirm("Are you sure you want to delete this proposal?"))
      return;

    try {
      await axios.delete(`${API_URL}/api/DeleteProposal/${id}`);
      setProposals((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  // ✅ Edit Proposal
  const handleEditClick = (proposal) => {
    if (!canDo(user, "proposals", "edit"))
      return alert("You do not have permission to edit proposals.");

    navigate(`/admin/updateProposal/${proposal._id}`);
  };

  // ✅ Badge colors
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

  // ✅ PAGE ACCESS CHECK
  if (!canViewPage(user, "proposals")) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view proposals.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>📜 Proposal List</h2>

      <table
        className="table table-striped table-bordered shadow-sm"
        style={{ width: "1600px" }}
      >
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

                {/* Services */}
                <td>
                  {proposal.services?.length > 0
                    ? proposal.services
                        .map((s) => s.name || s.serviceName)
                        .join(", ")
                    : "—"}
                </td>

                {/* Description */}
                <td>{proposal.description}</td>

                {/* Total Price */}
                <td>
                  {proposal.services?.length > 0
                    ? proposal.services.reduce(
                        (sum, s) => sum + (s.price || 0),
                        0
                      )
                    : 0}
                </td>

                <td>{proposal.terms}</td>

                <td>
                  <span className={`badge ${statusClass(proposal.status)}`}>
                    {proposal.status}
                  </span>
                </td>

                <td>{new Date(proposal.createdAt).toLocaleDateString()}</td>

                {/* ✅ ACTION BUTTONS WITH PERMISSIONS */}
                <td>
                  {/* Edit */}
                  {canDo(user, "proposals", "edit") && (
                    <button
                      className="btn btn-sm btn-warning me-2"
                      onClick={() => handleEditClick(proposal)}
                    >
                      ✏️ Edit & Send
                    </button>
                  )}

                  {/* Approve */}
                  {canDo(user, "proposals", "edit") && (
                    <button
                      className="btn btn-sm btn-success me-2"
                      disabled={
                        proposal.status === "Accepted" ||
                        proposal.status === "Rejected"
                      }
                      onClick={() => handleApprove(proposal._id)}
                    >
                      ✅ Approve
                    </button>
                  )}

                  {/* Delete */}
                  {canDo(user, "proposals", "delete") && (
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(proposal._id)}
                    >
                      🗑️ Delete
                    </button>
                  )}
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
