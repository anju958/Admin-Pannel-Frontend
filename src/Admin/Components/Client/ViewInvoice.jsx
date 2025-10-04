import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function ViewInvoice() {
  const { clientId } = useParams();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchInvoices = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/getInvoicebyClient/${clientId}`);
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error("Failed to fetch invoices:", err);
      setError("Failed to load invoices. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (clientId) fetchInvoices();
  }, [clientId]);

  if (loading) return <div className="text-center mt-5">Loading invoices...</div>;
  if (error) return <div className="text-danger text-center mt-5">{error}</div>;
  if (invoices.length === 0) return <div className="text-center mt-5">No invoices found.</div>;

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-center">Client Invoices</h2>

      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-dark">
            <tr>
              <th>Invoice #</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Total Amount</th>
              <th>Projects</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => {
              const totalAmount = invoice.projects.reduce(
                (sum, p) => sum + Number(p.amount),
                0
              );

              return (
                <tr key={invoice._id}>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{new Date(invoice.dueDate).toLocaleDateString()}</td>
                  <td>
                    <span
                      className={`badge ${
                        invoice.status === "Paid" ? "bg-success" : "bg-warning text-dark"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td>₹{totalAmount.toLocaleString()}</td>
                  <td>
                    <ul className="mb-0 ps-3">
                      {invoice.projects.map((p) => (
                        <li key={p.projectId?._id || p.projectId}>
                          {p.projectId?.projectName || p.projectId} — ₹
                          {Number(p.amount).toLocaleString()}
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewInvoice;
