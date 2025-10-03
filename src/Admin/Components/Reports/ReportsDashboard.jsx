import React from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

function ReportsDashboard() {
  // Dummy data
  const proposals = [
    { status: "Pending" },
    { status: "Approved" },
    { status: "Rejected" },
    { status: "Approved" },
  ];

  const invoices = [
    { status: "Paid" },
    { status: "Pending" },
    { status: "Paid" },
    { status: "Pending" },
    { status: "Paid" },
  ];

  // Count stats
  const totalProposals = proposals.length;
  const approvedProposals = proposals.filter((p) => p.status === "Approved").length;
  const pendingProposals = proposals.filter((p) => p.status === "Pending").length;

  const totalInvoices = invoices.length;
  const paidInvoices = invoices.filter((i) => i.status === "Paid").length;
  const pendingInvoices = invoices.filter((i) => i.status === "Pending").length;

  // Chart data (Bar)
  const barData = {
    labels: ["Proposals", "Invoices"],
    datasets: [
      {
        label: "Pending",
        data: [pendingProposals, pendingInvoices],
        backgroundColor: "rgba(255, 206, 86, 0.7)",
      },
      {
        label: "Approved/Paid",
        data: [approvedProposals, paidInvoices],
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
    ],
  };

  // Chart data (Pie)
  const pieData = {
    labels: ["Proposals", "Invoices"],
    datasets: [
      {
        label: "Total",
        data: [totalProposals, totalInvoices],
        backgroundColor: ["rgba(54, 162, 235, 0.7)", "rgba(255, 99, 132, 0.7)"],
      },
    ],
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">📊 Reports Dashboard</h2>

      {/* Summary Cards */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="shadow-sm text-center p-3">
            <h5>Total Proposals</h5>
            <h3>{totalProposals}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center p-3">
            <h5>Approved Proposals</h5>
            <h3>{approvedProposals}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center p-3">
            <h5>Total Invoices</h5>
            <h3>{totalInvoices}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center p-3">
            <h5>Paid Invoices</h5>
            <h3>{paidInvoices}</h3>
          </Card>
        </Col>
      </Row>

      {/* Charts */}
      <Row>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Proposal vs Invoice Status</h5>
            <Bar data={barData} />
          </Card>
        </Col>
        <Col md={6}>
          <Card className="shadow-sm p-3">
            <h5 className="text-center">Total Distribution</h5>
            <Pie data={pieData} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default ReportsDashboard;
