import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../../config'; 

function ClientHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCard, setSelectedCard] = useState(0);
  const [cards, setCards] = useState([
    { id: 1, title: 'Total Projects', number: 0 },
    { id: 2, title: 'Total Leaves', number: 0 },
    { id: 3, title: 'Pending Projects', number: 0 },
  ]);

  // Fetch employee stats
  const fetchStats = async () => {
    if (!user?.employeeId) return;

    try {
      const res = await axios.get(`${API_URL}/api/employeeStats/${user.employeeId}`);
      const data = res.data;

      setCards([
        { id: 1, title: 'Total Projects', number: data.totalProjects },
        { id: 2, title: 'Total Leaves', number: data.totalLeaves },
        { id: 3, title: 'Pending Projects', number: data.pendingProjects },
      ]);
    } catch (err) {
      console.error("Error fetching employee stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [user]);

  return (
    <Container fluid className="py-4" style={{ background: "#f8fafc", minHeight: "85vh" }}>
      <h1 className='text-center mb-4 fw-bold' style={{ letterSpacing: '1px' }}>
        Welcome to {user?.ename || "Employee"}
      </h1>

      <Row className="mb-4 mt-4 text-center justify-content-center">
        {cards.map((card, index) => (
          <Col key={card.id} md={3} className="mb-4">
            <Card
              className={`shadow-sm rounded-3 dashboard-card h-100 ${selectedCard === index ? 'border-primary' : ''}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedCard(index)}
            >
              <Card.Body>
                <h5 className="mb-2">{card.title}</h5>
                <h1 className="text-primary fw-bold display-5 mb-0">{card.number}</h1>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default ClientHome;
