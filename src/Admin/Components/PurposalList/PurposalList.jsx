import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import * as XLSX from "xlsx"; // ✅ Excel Export Library
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// Permission helper
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
  const [search, setSearch] = useState(""); // ✅ SEARCH
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch proposals
  useEffect(() => {
    const fetchProposals = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getAllProposal`);
        setProposals(res.data);
      } catch (err) {
        console.error("Error:", err);
      }
    };
    fetchProposals();
  }, []);

  // Approve proposal
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
      console.error(error);
    }
  };

  // Delete proposal
  const handleDelete = async (id) => {
    if (!canDo(user, "proposals", "delete"))
      return alert("You do not have permission to delete proposals.");

    if (!window.confirm("Are you sure you want to delete this proposal?")) return;

    try {
      await axios.delete(`${API_URL}/api/DeleteProposal/${id}`);
      setProposals(proposals.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  // Edit proposal
  const handleEditClick = (proposal) => {
    navigate(`/admin/updateProposal/${proposal._id}`);
  };

  // Status color
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

  // ✅ Excel Download
  const downloadExcel = () => {
    const excelData = proposals.map((p, i) => ({
      ID: i + 1,
      Client: p.clientId?.leadName || "N/A",
      Title: p.title,
      Services: p.services?.map((s) => s.name || s.serviceName).join(", "),
      Description: p.description,
      TotalPrice: p.services?.reduce((sum, s) => sum + (s.price || 0), 0),
      Terms: p.terms,
      Status: p.status,
      EnrollDate: new Date(p.createdAt).toLocaleDateString(),
    }));

    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Proposals");

    XLSX.writeFile(wb, "Proposals_List.xlsx");
  };

  // PAGE ACCESS CHECK
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

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>📜 Proposal List</h2>

        {/* ✅ Excel Download Button */}
        <button className="btn btn-success rounded-pill" onClick={downloadExcel}>
          ⬇️ Download Excel
        </button>
      </div>

      {/* ✅ SEARCH BAR */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search proposals..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <table className="table table-striped table-bordered shadow-sm">
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
          {proposals
            .filter((p) => {
              const q = search.toLowerCase();
              return (
                p.title?.toLowerCase().includes(q) ||
                p.clientId?.leadName?.toLowerCase().includes(q) ||
                p.status?.toLowerCase().includes(q) ||
                p.description?.toLowerCase().includes(q) ||
                p.services?.some((s) =>
                  (s.name || s.serviceName)?.toLowerCase().includes(q)
                )
              );
            })
            .map((proposal, index) => (
              <tr key={proposal._id}>
                <td>{index + 1}</td>
                <td>{proposal.clientId?.leadName}</td>
                <td>{proposal.title}</td>

                <td>
                  {proposal.services?.length
                    ? proposal.services
                        .map((s) => s.name || s.serviceName)
                        .join(", ")
                    : "—"}
                </td>

                <td>{proposal.description}</td>

                <td>
                  {proposal.services?.reduce(
                    (sum, s) => sum + (s.price || 0),
                    0
                  )}
                </td>

                <td>{proposal.terms}</td>

                <td>
                  <span className={`badge ${statusClass(proposal.status)}`}>
                    {proposal.status}
                  </span>
                </td>

                <td>{new Date(proposal.createdAt).toLocaleDateString()}</td>

                <td>
                  {canDo(user, "proposals", "edit") && (
                    <>
                      <button
                        className="btn btn-sm btn-warning me-2"
                        onClick={() => handleEditClick(proposal)}
                      >
                        ✏️ Edit & Send
                      </button>

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
                    </>
                  )}

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
            ))}
        </tbody>
      </table>
    </div>
  );
}

export default ProposalList;
