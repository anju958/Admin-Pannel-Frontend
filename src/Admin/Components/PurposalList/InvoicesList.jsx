import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [payNow, setPayNow] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/getAllInvoices`);
        const data = response.data;
        if (data.success && Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
          // PayNow is for new payments being made now
          const amounts = {};
          data.invoices.forEach((inv) => {
            amounts[inv._id] = "";
          });
          setPayNow(amounts);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        setInvoices([]);
      }
    };
    fetchInvoices();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`${API_URL}/api/deleteInvoice/${id}`);
      setInvoices(invoices.filter(inv => inv._id !== id));
    } catch (err) {}
  };

  const handlePayNowChange = (id, value) => {
    setPayNow(prev => ({ ...prev, [id]: value }));
  };

  const handleMarkPaid = async (invoice) => {
    const paymentNow = Number(payNow[invoice._id]) || 0;
    if (paymentNow <= 0) {
      alert("Please enter payment amount > 0");
      return;
    }
    if ((invoice.paidAmount || 0) + paymentNow > invoice.totalAmount) {
      alert("Total paid cannot exceed invoice total");
      return;
    }
    try {
      await axios.put(`${API_URL}/api/markpaid/${invoice._id}`, { paidAmount: paymentNow });
      alert("Invoice payment updated");
      setPayNow(prev => ({ ...prev, [invoice._id]: "" }));
      setInvoices((prev) =>
        prev.map((inv) =>
          inv._id === invoice._id
            ? {
                ...inv,
                paidAmount: (inv.paidAmount || 0) + paymentNow,
                remainingAmount: inv.totalAmount - ((inv.paidAmount || 0) + paymentNow),
                status: ((inv.paidAmount || 0) + paymentNow === inv.totalAmount)
                  ? "Paid"
                  : ((inv.paidAmount || 0) + paymentNow > 0)
                  ? "Partial"
                  : "Pending"
              }
            : inv
        )
      );
    } catch (error) {
      alert("Failed to update invoice payment");
    }
  };

  return (
    <div className="container mt-4">
      <h2>🧾 Invoice List</h2>
      <table className="table table-striped table-bordered shadow-sm">
        <thead className="table-dark">
          <tr>
            <th>#</th>
            <th>Invoice No</th>
            <th>Client</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Unpaid</th>
            <th>Pay Now</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice, idx) => {
              const paid = invoice.paidAmount || 0;
              const unpaid = invoice.totalAmount - paid;
              return (
                <tr key={invoice._id}>
                  <td>{idx + 1}</td>
                  <td>{invoice.invoiceNumber}</td>
                  <td>{invoice.clientName}</td>
                  <td>
                    <b>₹{invoice.totalAmount.toLocaleString()}</b>
                  </td>
                  <td style={{ color: "#2e7d32", fontWeight: 600 }}>
                    ₹{paid.toLocaleString()}
                  </td>
                  <td style={{ color: "#c62828", fontWeight: 600 }}>
                    ₹{unpaid.toLocaleString()}
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      max={unpaid}
                      value={payNow[invoice._id]}
                      onChange={e => handlePayNowChange(invoice._id, e.target.value)}
                      style={{ width: "80px" }}
                      disabled={invoice.status === "Paid"}
                      placeholder="Enter ₹"
                    />
                    <button
                      className="btn btn-sm btn-success ms-2"
                      onClick={() => handleMarkPaid(invoice)}
                      disabled={
                        invoice.status === "Paid" ||
                        !payNow[invoice._id] ||
                        Number(payNow[invoice._id]) <= 0
                      }
                    >
                      ✓ Pay
                    </button>
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        invoice.status === "Paid"
                          ? "bg-success"
                          : invoice.status === "Partial"
                          ? "bg-info text-dark"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {invoice.status}
                    </span>
                  </td>
                  <td>
                    {invoice.dueDate
                      ? new Date(invoice.dueDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    {invoice.date
                      ? new Date(invoice.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-info me-2"
                      onClick={() => navigate(`/admin/viewInvoice/${invoice._id}`)}
                    >
                      👁️ View
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(invoice._id)}
                    >
                      🗑️ Delete
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="11" className="text-center text-muted">
                No invoices found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;
