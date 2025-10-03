

import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";

function Admin() {
  const [selectedCard, setSelectedCard] = useState(0);

  const cards = [
    { id: 1, title: "Total Employees", number: 200 },
    { id: 2, title: "Total Projects", number: 23 },
    { id: 3, title: "Total Clients", number: 300 },
    { id: 4, title: "Pending Payments", number: 20000 },
    { id: 5, title: "Jobs Opening", number: 10 },
  ];

  return (
    <div className="container py-4">
      <h1 className="text-center mb-4">Welcome to Admin Dashboard</h1>

      <div className="row justify-content-center">
        {cards.map((card, index) => (
          <div
            key={card.id}
            className="col-sm-6 col-md-4 col-lg-3 mb-4"
            onClick={() => setSelectedCard(index)}
          >
            <div
              className={`card shadow h-100 text-center ${
                selectedCard === index ? "border-primary" : ""
              }`}
              style={{ cursor: "pointer" }}
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
