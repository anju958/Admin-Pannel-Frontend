import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { useParams, Link } from "react-router-dom";

const ClientProposalView = () => {
  const { proposalId } = useParams();
  const [proposal, setProposal] = useState(null);

  useEffect(() => {
    axios
      .get(`${API_URL}/api/client/client-proposal/${proposalId}`)
      .then((res) => setProposal(res.data.proposal))
      .catch((err) => console.error("Error loading proposal:", err));
  }, [proposalId]);

  if (!proposal)
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "60vh" }}
      >
        <h3 className="text-muted fw-semibold">Loading...</h3>
      </div>
    );

  return (
    <div className="container mt-4">

      {/* HEADER */}
      <div
        className="p-3 mb-4"
        style={{
          background: "linear-gradient(90deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
          borderRadius: "14px",
          boxShadow: "0px 4px 12px rgba(0,0,0,0.15)",
          color: "white",
        }}
      >
        <h2 className="fw-bold m-0">{proposal.title || proposal.subject}</h2>
      </div>

      {/* MAIN CARD */}
      <div
        className="shadow-lg p-4 border-0"
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
        }}
      >
        {/* DESCRIPTION SECTION */}
        <h4 className="fw-bold mb-3">Proposal Details</h4>

        <p
          className="fs-5"
          style={{
            whiteSpace: "pre-wrap",
            background: "#f8f9fa",
            padding: "15px",
            borderRadius: "10px",
            lineHeight: "1.7",
          }}
        >
          {proposal.description || proposal.summary}
        </p>

        {/* ATTACHMENTS */}
        {proposal.attachments?.length > 0 && (
          <div className="mt-4">
            <h4 className="fw-bold mb-2">Attachments</h4>

            <div className="list-group">
              {proposal.attachments.map((a, i) => (
                <a
                  key={i}
                  href={`${API_URL}/${a}`}
                  target="_blank"
                  rel="noreferrer"
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  style={{
                    borderRadius: "10px",
                    marginBottom: "8px",
                    padding: "12px 18px",
                    fontWeight: "500",
                  }}
                >
                  📄 Attachment {i + 1}
                  <span className="text-primary fw-bold">Download</span>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* BACK BUTTON */}
        <Link
          to="/client/proposals"
          className="btn btn-secondary mt-4 px-4"
          style={{
            borderRadius: "10px",
            fontWeight: "600",
            padding: "10px 20px",
          }}
        >
          ← Back
        </Link>
      </div>
    </div>
  );
};

export default ClientProposalView;
