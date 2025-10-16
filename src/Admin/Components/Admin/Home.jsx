import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { API_URL } from "../../../config";

function Admin() {
  const [selectedCard, setSelectedCard] = useState(0);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/AdminSummary`)
      .then((res) => res.json())
      .then((data) => {
        setSummary(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="container py-4 text-center">Loading...</div>;
  }
  if (!summary) {
    return <div className="container py-4 text-danger text-center">Failed to load summary!</div>;
  }

  const cards = [
    { id: 1, title: "Total Employees", number: summary.totalEmployees },
    { id: 2, title: "Total Projects", number: summary.totalProjects },
    { id: 3, title: "Total Clients", number: summary.totalClients },
    { id: 4, title: "Pending Payments", number: summary.pendingPayments?.toLocaleString() },
    { id: 5, title: "Jobs Opening", number: summary.jobsOpening },
  ];

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Welcome to Admin Dashboard</h1>
      <div className="row justify-content-center">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="col-sm-6 col-md-4 col-lg-3 mb-4"  // Was col-lg-2
            style={{ minWidth: "250px", maxWidth: "350px" }} // Add this for consistent width
            onClick={() => setSelectedCard(index)}
          >
            <div
              className={`card shadow h-100 text-center ${selectedCard === index ? "border-primary" : ""}`}
              style={{ cursor: "pointer", width: "100%" }} // Ensure card fills container
            >
              <div className="card-body">
                <h5 className="card-title">{card.title}</h5>
                <p className="card-text display-6 fw-bold">{card.number}</p>
              </div>
            </div>
          </div>
        ))}
      </div>


    </div>
  );
}

export default Admin;
