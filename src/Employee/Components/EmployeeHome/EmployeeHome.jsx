import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../../config';
import { useNavigate } from "react-router-dom";

function EmployeeHome() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [selectedCard, setSelectedCard] = useState(0);
  const navigate = useNavigate();

  const [cards, setCards] = useState([
    { id: 1, title: 'Total Projects', number: 0 },
    { id: 2, title: 'Completed Project', number: 0 },
    { id: 3, title: 'Pending Projects', number: 0 },
  ]);

  // Dummy tasks for UI
  const dummyTasks = [
    {
      id: 1,
      taskName: "Website Landing Page",
      description: "Build responsive home section",
      startDate: "2025-02-20",
      dueDate: "2025-02-25",
      timeSpent: "3 hrs",
      status: "In Progress"
    },
    {
      id: 2,
      taskName: "API Integration",
      description: "Connect frontend with backend",
      startDate: "2025-02-15",
      dueDate: "2025-02-20",
      timeSpent: "5 hrs",
      status: "Pending"
    },
    {
      id: 3,
      taskName: "UI Fixes",
      description: "Fix CSS issues and responsiveness",
      startDate: "2025-02-10",
      dueDate: "2025-02-12",
      timeSpent: "2 hrs",
      status: "Completed"
    }
  ];

  const fetchStats = async () => {
    if (!user?.employeeId) return;
    try {
      const res = await axios.get(`${API_URL}/api/employeeStats/${user.employeeId}`);
      const data = res.data;

      setCards([
        { id: 1, title: 'Total Projects', number: data.projects.total },
        { id: 2, title: 'Completed Project', number: data.projects.completed },
        { id: 3, title: 'Pending Projects', number: data.projects.pending },
      ]);

    } catch (err) {
      console.error("Error fetching employee stats:", err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);
  // Month filter state
  const [selectedMonth, setSelectedMonth] = useState("all");

  // Filter tasks by selected month
  const filteredTasks = dummyTasks.filter((task) => {
    if (selectedMonth === "all") return true;

    const taskMonth = new Date(task.startDate).getMonth() + 1; // 1-12
    return Number(selectedMonth) === taskMonth;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed":
        return <Badge bg="success">{status}</Badge>;
      case "In Progress":
        return <Badge bg="warning" text="dark">{status}</Badge>;
      default:
        return <Badge bg="danger">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="py-4" style={{ background: "#f8fafc", minHeight: "85vh" }}>

      {/* Heading */}
      <h1 className='text-center mb-4 fw-bold' style={{ letterSpacing: '1px' }}>
        Welcome to {user?.ename || "Employee"}
      </h1>

      {/* Cards */}
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

      {/* -------- TASK TABLE UI START -------- */}
      {/* -------- TASK TABLE WITH MONTH FILTER -------- */}
      <Card className="shadow-sm mt-5 p-4">

        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3 className="mb-0">Your Tasks</h3>

          {/* Month Filter */}
          <select
            className="form-select w-auto"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          >
            <option value="all">All Months</option>
            <option value="1">January</option>
            <option value="2">February</option>
            <option value="3">March</option>
            <option value="4">April</option>
            <option value="5">May</option>
            <option value="6">June</option>
            <option value="7">July</option>
            <option value="8">August</option>
            <option value="9">September</option>
            <option value="10">October</option>
            <option value="11">November</option>
            <option value="12">December</option>
          </select>
           <button
      className="btn btn-primary fw-semibold"
      onClick={() => navigate("/employee/task")}
    >
      Go to  Tasks →
    </button>
        </div>

        <Table striped bordered hover responsive className="text-center">
          <thead style={{ background: "#e9ecef" }}>
            <tr>
              <th>Task Name</th>
              <th>Description</th>
              <th>Start Date</th>
              <th>Due Date</th>
              <th>Time Spent</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center text-danger fw-bold py-3">
                  No tasks found for this month
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.taskName}</td>
                  <td>{task.description}</td>
                  <td>{task.startDate}</td>
                  <td>{task.dueDate}</td>
                  <td>{task.timeSpent}</td>
                  <td>{getStatusBadge(task.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
      {/* -------- TASK TABLE END -------- */}

   

    </Container>
  );
}

export default EmployeeHome;
