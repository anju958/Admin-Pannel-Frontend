import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../config';

function ClientHome() {
  const client = JSON.parse(localStorage.getItem("clientUser"));
  const [selectedCard, setSelectedCard] = useState(0);
  const [cards, setCards] = useState([
    { id: 1, title: 'Total Projects', number: 0 },
    { id: 2, title: 'Total Proposals', number: 0 },
    { id: 3, title: 'Pending Projects', number: 0 },
  ]);

  const fetchStats = async () => {
    if (!client?._id) return;
    try {
      const res = await axios.get(`${API_URL}/api/clientStats/${client._id}`);
      const data = res.data;
      setCards([
        { id: 1, title: 'Total Projects', number: data.totalProjects },
        { id: 2, title: 'Total Proposals', number: data.totalProposals },
        { id: 3, title: 'Pending Projects', number: data.pendingProjects },
      ]);
    } catch (err) {
      console.error("Error fetching client stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [client]);

  return (
    <Container fluid className="py-4 d-flex flex-column align-items-center" style={{ background: "#f8fafc", minHeight: "85vh" }}>
      <h1 className="mb-2 fw-bold text-center" style={{ letterSpacing: '1px', fontSize: '2.5rem' }}>
        Welcome to Client Dashboard
      </h1>
      <h3 className="mb-4 fw-bold text-center" style={{ fontSize: "1.6rem" }}>
        {client?.leadName}
      </h3>
      <Row className="mb-4 mt-4 justify-content-center" style={{ width: "100%" }}>
        {cards.map((card, index) => (
          <Col key={card.id} xs={12} md={4} className="d-flex align-items-stretch mb-4">
            <Card
              className={`shadow-sm rounded-3 dashboard-card w-100 ${selectedCard === index ? 'border-primary' : ''}`}
              style={{
                cursor: "pointer",
                minHeight: "170px",           // Fixed height for professional layout
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center"
              }}
              onClick={() => setSelectedCard(index)}
            >
              <Card.Body>
                <h5 className="mb-2 text-center">{card.title}</h5>
                <h1 className="text-primary fw-bold display-5 mb-0 text-center">{card.number}</h1>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ClientHome;
