import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

const ClientHome = () => {
  const [summary, setSummary] = useState({
    totalProjects: 0,
    totalProposals: 0,
    pendingProjects: 0,
  });

  const client = JSON.parse(localStorage.getItem("clientUser"));

  useEffect(() => {
    if (!client?._id) return;

    axios
      .get(`${API_URL}/api/client/dashboard/${client._id}`)
      .then((res) => setSummary(res.data))
      .catch((err) => console.error("Dashboard Error:", err));
  }, []);

  return (
    <div className="client-dashboard">

      {/* Top Gradient Header */}
      <div className="client-header">
        <h1>Welcome to Client Dashboard</h1>
        <h3>{client?.clientName}</h3>
      </div>

      {/* Stats Cards */}
      <div className="client-cards">

        <div className="client-card">
          <h4>Total Projects</h4>
          <h1 className="client-number">{summary.totalProjects}</h1>
        </div>

        <div className="client-card">
          <h4>Total Proposals</h4>
          <h1 className="client-number">{summary.totalProposals}</h1>
        </div>

        <div className="client-card">
          <h4>Pending Projects</h4>
          <h1 className="client-number">{summary.pendingProjects}</h1>
        </div>

      </div>
    </div>
  );
};

export default ClientHome;
