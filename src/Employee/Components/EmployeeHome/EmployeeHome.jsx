import React, { useEffect, useMemo, useState } from 'react';
import { Container, Row, Col, Card, Table, Badge } from 'react-bootstrap';
import axios from 'axios';
import { API_URL } from '../../../config';
import { useNavigate } from "react-router-dom";

function EmployeeHome() {
  const navigate = useNavigate();

  // Safe read + tolerate _id or employeeId
  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch (_) {
      return null;
    }
  }, []);

  const employeeId = storedUser?.employeeId || storedUser?._id || null;

  const [selectedCard, setSelectedCard] = useState(0);
  const [selectedMonth, setSelectedMonth] = useState("all");
  const [selectedYear, setSelectedYear] = useState("all");
  const [tasks, setTasks] = useState([]);
  const [authChecked, setAuthChecked] = useState(false);

  const [cards, setCards] = useState([
    { id: 1, title: 'Total Projects', number: 0 },
    { id: 2, title: 'Completed Project', number: 0 },
    { id: 3, title: 'Pending Projects', number: 0 },
  ]);

  // Auth guard
  useEffect(() => {
    if (!storedUser || !employeeId) {
      navigate("/login");
    } else {
      setAuthChecked(true);
    }
  }, [storedUser, employeeId, navigate]);

  // Fetch tasks
  const fetchEmployeeTasks = async () => {
    if (!employeeId) return;
    try {
      const res = await axios.get(`${API_URL}/api/getEmplyeeTask/${employeeId}`, {
        params: { month: selectedMonth, year: selectedYear }
      });
      const sorted = res.data.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
      setTasks(sorted);
    } catch (err) {
      console.error("Error fetching tasks:", err.response?.data || err.message);
      setTasks([]);
    }
  };

  // Fetch stats
  const fetchStats = async () => {
    if (!employeeId) return;
    try {
      const res = await axios.get(`${API_URL}/api/employeeStats/${employeeId}`);
      const data = res.data;
      setCards([
        { id: 1, title: 'Total Projects', number: data.projects?.total || 0 },
        { id: 2, title: 'Completed Project', number: data.projects?.completed || 0 },
        { id: 3, title: 'Pending Projects', number: data.projects?.pending || 0 },
      ]);
    } catch (err) {
      console.error("Error fetching employee stats:", err.response?.data || err.message);
    }
  };

  // Fetch after auth check + filters
  useEffect(() => {
    if (!authChecked) return;
    fetchEmployeeTasks();
    fetchStats();
  }, [authChecked, selectedMonth, selectedYear]);

  const getStatusBadge = (status) => {
    switch (status) {
      case "Completed": return <Badge bg="success">{status}</Badge>;
      case "In Progress": return <Badge bg="warning" text="dark">{status}</Badge>;
      default: return <Badge bg="secondary">{status}</Badge>;
    }
  };

  return (
    <Container fluid className="py-4" style={{ background: "#f8fafc", minHeight: "85vh" }}>
      <h1 className='text-center mb-4 fw-bold'>Welcome {storedUser?.ename || "Employee"}</h1>
      <Row className="mb-4 mt-4 text-center justify-content-center">
        {cards.map((card, index) => (
          <Col key={card.id} md={3} className="mb-4">
            <Card
              className={`shadow-sm rounded-3 h-100 ${selectedCard === index ? 'border-primary' : ''}`}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedCard(index)}
            >
              <Card.Body>
                <h5 className="mb-2">{card.title}</h5>
                <h1 className="text-primary fw-bold display-5 mb-0">
                  {card.number}
                </h1>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Card className="shadow-sm mt-5 p-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h3>Your Tasks</h3>
          <div className="d-flex gap-2">
            <select className="form-select w-auto" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)}>
              <option value="all">All Months</option>
              {[...Array(12)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString('en', { month: 'long' })}
                </option>
              ))}
            </select>
            <select className="form-select w-auto" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
              <option value="all">All Years</option>
              {[2023, 2024, 2025, 2026].map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => navigate("/employee/employeeTask")}>
            Go to Tasks →
          </button>
        </div>

        <Table striped bordered hover responsive className="text-center">
          <thead>
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
            {tasks.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-danger fw-bold">No tasks found</td>
              </tr>
            ) : (
              tasks.map(task => (
                <tr key={task._id}>
                  <td>{task.title}</td>
                  <td>{task.description}</td>
                  <td>{task.startDate?.split("T")[0]}</td>
                  <td>{task.dueDate?.split("T")[0]}</td>
                  <td>{(task.timeSpent / 3600).toFixed(1)} hrs</td>
                  <td>{getStatusBadge(task.status)}</td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>
    </Container>
  );
}

export default EmployeeHome;