

import React, { useEffect, useState } from "react";
import { Card, Row, Col } from "react-bootstrap";
import { Bar, Pie } from "react-chartjs-2";
import { API_URL } from "../../../config";
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
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/reports/summary`)
      .then((response) => {
        if (!response.ok) throw new Error("Failed to fetch data");
        return response.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="container mt-4">Loading...</div>;
  if (error) return <div className="container mt-4 text-danger">Error: {error}</div>;

  // Use data from API response
  const proposals = [
    { status: "Pending", count: data.proposals.pending || 0 },
    { status: "Approved", count: data.proposals.approved || 0 },
    { status: "Rejected", count: data.proposals.rejected || 0 },
    { status: "Draft", count: data.proposals.draft || 0 },
  ];

  const invoices = [
    { status: "Paid", count: data.invoices.paid || 0 },
    { status: "Partial", count: data.invoices.partial || 0 },
    { status: "Pending", count: data.invoices.pending || 0 },
  ];

  const totalProposals = data.proposals.total || 0;
  const approvedProposals = data.proposals.approved || 0;
  const pendingProposals = data.proposals.pending || 0;

  const totalInvoices = data.invoices.total || 0;
  const paidInvoices = data.invoices.paid || 0;
  const pendingInvoices = data.invoices.pending || 0;

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
        <Col md={2}>
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
        <Col md={2}>
          <Card className="shadow-sm text-center p-3">
            <h5>Total Invoices</h5>
            <h3>{totalInvoices}</h3>
          </Card>
        </Col>
        <Col md={2}>
          <Card className="shadow-sm text-center p-3">
            <h5>Paid Invoices</h5>
            <h3>{paidInvoices}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="shadow-sm text-center p-3">
            <h5>Partial Payment Pending</h5>
            <h3>
              ₹{(data.invoices.partialPendingAmount ?? 0).toLocaleString()}
            </h3>
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
