
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/getAllInvoice");
        const data = response.data;
        if (data.success && Array.isArray(data.invoices)) {
          setInvoices(data.invoices);
        } else {
          setInvoices([]);
        }
      } catch (err) {
        console.error("Error fetching invoices:", err);
        setInvoices([]);
      }
    };
    fetchInvoices();
  }, []); // <-- fetch once on mount

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this invoice?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/deleteInvoice/${id}`);
      setInvoices(invoices.filter(inv => inv._id !== id));
    } catch (err) {
      console.error("Error deleting invoice:", err);
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
            <th>Total Amount</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Created On</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {invoices.length > 0 ? (
            invoices.map((invoice, idx) => (
              <tr key={invoice._id}>
                <td>{idx + 1}</td>
                <td>{invoice.invoiceNumber}</td>
                <td>{invoice.clientName}</td>
                <td>₹{invoice.totalAmount}</td>
                <td>
                  <span className={`badge ${
                    invoice.status === "Paid" ? "bg-success" :
                    invoice.status === "Pending" ? "bg-warning text-dark" : "bg-danger"
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td>{invoice.dueDate ? new Date(invoice.dueDate).toLocaleDateString() : "-"}</td>
                <td>{invoice.date ? new Date(invoice.date).toLocaleDateString() : "-"}</td>
                <td>
                  <button className="btn btn-sm btn-info me-2"
                    onClick={() => navigate(`/admin/viewInvoice/${invoice._id}`)}>👁️ View</button>
                  <button className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(invoice._id)}>🗑️ Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" className="text-center text-muted">No invoices found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default InvoiceList;
