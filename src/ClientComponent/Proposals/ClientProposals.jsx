import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";
import { Link } from "react-router-dom";

const ClientProposals = () => {
  const client = JSON.parse(localStorage.getItem("clientUser") || "null");
  const [proposals, setProposals] = useState([]);

  useEffect(() => {
    if (!client?._id) return;

    axios
      .get(`${API_URL}/api/client/client-proposals/${client._id}`)
      .then((res) => setProposals(res.data.proposals || []))
      .catch((err) => console.error("Proposal load error:", err));
  }, [client]);

  return (
    <div className="container mt-4">

      {/* Gradient Title Block */}
      <div
        className="mb-4 p-3"
        style={{
          background: "linear-gradient(90deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
          color: "white",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h2 className="fw-bold m-0">Client Proposals</h2>
      </div>

      {proposals.length === 0 && (
        <div className="alert alert-info fs-5">No proposals available.</div>
      )}

      <div className="row g-4">
        {proposals.map((p) => (
          <div key={p._id} className="col-md-12">
            <div
              className="shadow proposal-card"
              style={{
                background: "white",
                borderRadius: "12px",
                padding: "20px",
                transition: "0.2s",
              }}
            >
              <div className="d-flex justify-content-between">

                {/* LEFT SIDE CONTENT */}
                <div style={{ maxWidth: "75%" }}>
                  <h4 className="fw-bold text-dark mb-2" style={{ fontSize: "1.4rem" }}>
                    {p.title || p.subject}
                  </h4>

                  {/* SUMMARY */}
                  <p className="text-muted mb-2" style={{ fontSize: "0.95rem" }}>
                    {p.summary?.length > 150
                      ? p.summary.slice(0, 150) + "..."
                      : p.summary || "No summary available."}
                  </p>

                  {/* STATUS BADGE (if exists) */}
                  {p.status && (
                    <span
                      className="badge px-3 py-2"
                      style={{
                        fontSize: "0.85rem",
                        background:
                          p.status === "Approved"
                            ? "#28a745"
                            : p.status === "Pending"
                            ? "#ffc107"
                            : "#17a2b8",
                        color: "white",
                        borderRadius: "10px",
                      }}
                    >
                      {p.status}
                    </span>
                  )}
                </div>

                {/* RIGHT SIDE BUTTON */}
                <div className="text-end">
                  <Link
                    to={`/client/proposal/${p._id}`}
                    className="btn btn-primary"
                    style={{
                      borderRadius: "10px",
                      padding: "10px 22px",
                      fontSize: "1rem",
                      fontWeight: "600",
                    }}
                  >
                    View →
                  </Link>
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default ClientProposals;
