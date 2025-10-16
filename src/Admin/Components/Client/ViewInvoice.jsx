import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function InvoiceDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getInvoiceById/${id}`);
        if (response.data.success) setInvoice(response.data.invoice);
      } catch (err) {
        alert("Could not load invoice details.");
      } finally {
        setLoading(false);
      }
    };
    fetchInvoice();
  }, [id]);

  if (loading) return <div className="container mt-3">Loading…</div>;
  if (!invoice) return <div className="container mt-3">Invoice not found.</div>;

  return (
    <div className="container mt-4">
      <button className="btn btn-secondary mb-3" onClick={() => navigate(-1)}>
        ← Back to List
      </button>
      <div className="card shadow">
        <div className="card-body">
          <h2 className="card-title mb-1">Invoice #{invoice.invoiceNumber}</h2>
          <div className="mb-3"> 
            <span className="fw-bold">Client:</span> {invoice.clientName} <br/>
            <span className="fw-bold">Email:</span> {invoice.clientEmail}
          </div>
          <div className="mb-3">
            <span className="fw-bold">Issued:</span> {invoice.date ? new Date(invoice.date).toLocaleDateString() : "-"}
            <br/>
            <span className="fw-bold">Due Date:</span> {invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}
            <br/>
            <span className="fw-bold">Status:</span>{" "}
            <span className={`badge ${
              invoice.status === "Paid" ? "bg-success" :
              invoice.status === "Partial" ? "bg-info text-dark" :
              invoice.status === "Pending" ? "bg-warning text-dark" : "bg-danger"
            }`}>{invoice.status}</span>
          </div>
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Project/Service</th>
                <th>Amount (₹)</th>
              </tr>
            </thead>
            <tbody>
              {invoice.projects.map((p, i) => (
                <tr key={i}>
                  <td>
                    {typeof p.projectId === "object" && p.projectId?.projectName
                      ? p.projectId.projectName
                      : p.name || p.title || p.projectId || "Service"}
                  </td>
                  <td>₹{Number(p.amount).toLocaleString()}</td>
                </tr>
              ))}
              <tr>
                <td className="fw-bold">Total</td>
                <td className="fw-bold">₹{invoice.totalAmount.toLocaleString()}</td>
              </tr>
            </tbody>
          </table>
          <div className="mb-2">
            <span className="fw-bold">Paid Amount:</span> ₹{(invoice.paidAmount || 0).toLocaleString()}<br />
            <span className="fw-bold">Remaining:</span> ₹{(invoice.remainingAmount !== undefined ? invoice.remainingAmount : invoice.totalAmount - (invoice.paidAmount || 0)).toLocaleString()}
          </div>
          <div>
            <span className="fw-bold">Bank Details:</span>
            <ul>
              <li><b>Bank:</b> YOUR_BANK_NAME</li>
              <li><b>Account Number:</b> XXXXX1234567</li>
              <li><b>IFSC:</b> IFSC0000123</li>
              <li><b>Account Holder:</b> YOUR_NAME</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InvoiceDetail;
