import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function ClientInvoicesList({ clientId }) {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // LOG #1: What clientId are we using?
  console.log("CLIENT INVOICES LIST: clientId prop =", clientId);

  useEffect(() => {
    // LOG #2: which URL is hit
    console.log('Request URL:', `${API_URL}/api/getInvoicesByClient/${clientId}`);

    if (!clientId) return;
    setLoading(true);

    axios
      .get(`${API_URL}/api/getInvoicesByClient/${clientId}`)
      .then((res) => {
        // LOG #3: What response did we get?
        console.log('Invoice API response:', res);

        if (res.data && res.data.success) {
          setInvoices(res.data.invoices);
        } else {
          setInvoices([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        // LOG #4: Any error from API?
        console.error("API error:", err);
        setInvoices([]);
        setLoading(false);
      });
  }, [clientId]);

  if (loading) return <div>Loading client invoices...</div>;
  if (invoices.length === 0) return <div>No invoices found for this client.</div>;

  return (
    <div className="mt-4">
      {/* Back button */}
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>
      <h5 className="mb-3">Client Invoices</h5>
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>#</th>
            <th>Invoice No</th>
            <th>Date</th>
            <th>Total</th>
            <th>Status</th>
            <th>Due Date</th>
            <th>Details</th>
          </tr>
        </thead>
        <tbody>
          {invoices.map((inv, idx) => (
            <tr key={inv._id}>
              <td>{idx + 1}</td>
              <td
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/admin/viewInvoice/${inv._id}`)}
              >
                {inv.invoiceNumber}
              </td>
              <td>{inv.date ? new Date(inv.date).toLocaleDateString() : "-"}</td>
              <td>₹{inv.totalAmount.toLocaleString()}</td>
              <td>
                <span
                  className={`badge ${
                    inv.status === "Paid"
                      ? "bg-success"
                      : inv.status === "Draft"
                      ? "bg-warning text-dark"
                      : "bg-secondary"
                  }`}
                >
                  {inv.status}
                </span>
              </td>
              <td>
                {inv.dueDate ? new Date(inv.dueDate).toLocaleDateString() : "-"}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-info"
                  onClick={() => navigate(`/admin/viewInvoice/${inv._id}`)}
                >
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ClientInvoicesList;
