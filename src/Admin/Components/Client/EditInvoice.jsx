// EditInvoice.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function formatCurrency(num) {
  if (num === undefined || num === null || isNaN(num)) return "₹0";
  return `₹${Number(num).toLocaleString()}`;
}

function safeNumber(v) {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function EditInvoice() {
  const { id } = useParams(); // invoice id
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [errors, setErrors] = useState({});

  // fetch invoice on load
  useEffect(() => {
    if (!id) return;
    const fetchInvoice = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`${API_URL}/api/getInvoiceById/${id}`);
        const data = res.data?.invoice || res.data;
        if (!data) throw new Error("Invoice not found");
        // normalize projects lines to ensure editable shape
        const normalizedProjects = (data.projects || []).map((p) => ({
          projectId: p.projectId || p._id || null,
          projectName:
            p.projectName ||
            p.name ||
            (typeof p.projectId === "object" && p.projectId?.projectName) ||
            p.title ||
            "Unnamed Project",
          amount: safeNumber(p.amount),
        }));

        setInvoice({
          ...data,
          projects: normalizedProjects,
          paidAmount: safeNumber(data.paidAmount),
          remainingAmount:
            data.remainingAmount !== undefined
              ? safeNumber(data.remainingAmount)
              : safeNumber(data.totalAmount) - safeNumber(data.paidAmount),
        });
      } catch (err) {
        console.error(err);
        alert("Unable to load invoice. Check console for details.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  // helpers: update a field on invoice
  const updateInvoiceField = (field, value) => {
    setInvoice((prev) => ({ ...prev, [field]: value }));
  };

  // update a project line
  const updateProjectLine = (index, field, value) => {
    setInvoice((prev) => {
      const projects = [...(prev.projects || [])];
      projects[index] = { ...projects[index], [field]: field === "amount" ? safeNumber(value) : value };
      return { ...prev, projects };
    });
  };

  const addProjectLine = () => {
    setInvoice((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { projectId: null, projectName: "", amount: 0 },
      ],
    }));
  };

  const removeProjectLine = (index) => {
    setInvoice((prev) => {
      const projects = [...(prev.projects || [])];
      projects.splice(index, 1);
      return { ...prev, projects };
    });
  };

  const recalcTotals = () => {
    if (!invoice) return { totalAmount: 0, remainingAmount: 0 };
    const total = (invoice.projects || []).reduce(
      (s, p) => s + safeNumber(p.amount),
      0
    );
    const paid = safeNumber(invoice.paidAmount);
    const remaining = safeNumber(invoice.remainingAmount !== undefined ? invoice.remainingAmount : total - paid);
    return { totalAmount: total, remainingAmount: remaining };
  };

  const { totalAmount, remainingAmount } = recalcTotals();

  // validation before saving
  const validate = () => {
    const e = {};
    if (!invoice.clientEmail && !invoice.clientEmail?.length) {
      // also fallback to clientEmail or clientEmail-like fields
      if (!invoice.clientEmail && !invoice.clientEmail?.length) {
        e.clientEmail = "Client email is required.";
      }
    }
    if (!invoice.clientName && !invoice.clientName?.length) {
      e.clientName = "Client name is required.";
    }
    if (!invoice.dueDate) e.dueDate = "Due date is required.";
    if (!invoice.projects || invoice.projects.length === 0)
      e.projects = "At least one project/service is required.";
    (invoice.projects || []).forEach((p, idx) => {
      if (!p.projectName || !p.projectName.trim()) {
        e[`pname_${idx}`] = "Project name required.";
      }
      if (safeNumber(p.amount) <= 0) {
        e[`pamount_${idx}`] = "Amount must be > 0.";
      }
    });

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // Save updated invoice to backend
  const handleSave = async () => {
    if (!invoice) return;
    if (!validate()) {
      alert("Please fix validation errors before saving.");
      return;
    }

    setSaving(true);
    try {
      // prepare payload; adapt shape to your backend
      const payload = {
        clientId: invoice.clientId,
        clientName: invoice.clientName,
        clientEmail: invoice.clientEmail,
        date: invoice.date,
        dueDate: invoice.dueDate,
        status: invoice.status,
        projects: (invoice.projects || []).map((p) => ({
          projectId: p.projectId || null,
          projectName: p.projectName,
          amount: safeNumber(p.amount),
        })),
        totalAmount: totalAmount,
        paidAmount: safeNumber(invoice.paidAmount),
        remainingAmount: remainingAmount,
        notes: invoice.notes || "",
      };

      // Note: change endpoint if your backend expects different path (e.g., /api/invoices/:id)
      const res = await axios.put(`${API_URL}/api/updateInvoice/${id}`, payload);
      const updated = res.data?.invoice || res.data;
      setInvoice((prev) => ({ ...prev, ...updated }));
      alert("Invoice saved successfully.");
    } catch (err) {
      console.error(err);
      alert("Failed to save invoice. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  // Send invoice email
  const handleSendEmail = async () => {
    if (!invoice) return;
    // optional: validate required email before sending
    if (!invoice.clientEmail) {
      alert("Client email is missing. Add client email before sending.");
      return;
    }

    setSending(true);
    try {
      await axios.post(`${API_URL}/api/sendInvoice/${id}`);
      alert("Invoice email sent successfully.");
      // optionally update status locally
      setInvoice((prev) => ({ ...prev, status: "Pending" }));
    } catch (err) {
      console.error(err);
      alert("Failed to send invoice email. See console for details.");
    } finally {
      setSending(false);
    }
  };

  if (loading) return <div className="container mt-3">Loading invoice…</div>;
  if (!invoice) return <div className="container mt-3">Invoice not found.</div>;

  const isPaid = invoice.status === "Paid";

  return (
    <div className="container mt-4" style={{ maxWidth: 900 }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Edit Invoice #{invoice.invoiceNumber || invoice._id}</h3>
        <div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => navigate(`/invoice-detail/${invoice._id}`)}
          >
            Preview
          </button>
          <button
            className="btn btn-outline-primary me-2"
            onClick={handleSave}
            disabled={saving || isPaid}
          >
            {saving ? "Saving…" : "Save"}
          </button>
          <button
            className="btn btn-success"
            onClick={handleSendEmail}
            disabled={sending || isPaid}
          >
            {sending ? "Sending…" : "Send Email"}
          </button>
        </div>
      </div>

      <div className="card mb-3 shadow-sm">
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Client Name</label>
              <input
                type="text"
                className={`form-control ${errors.clientName ? "is-invalid" : ""}`}
                value={invoice.clientName || ""}
                onChange={(e) => updateInvoiceField("clientName", e.target.value)}
                disabled={isPaid}
              />
              {errors.clientName && <div className="invalid-feedback">{errors.clientName}</div>}
            </div>

            <div className="col-md-6">
              <label className="form-label">Client Email</label>
              <input
                type="email"
                className={`form-control ${errors.clientEmail ? "is-invalid" : ""}`}
                value={invoice.clientEmail || ""}
                onChange={(e) => updateInvoiceField("clientEmail", e.target.value)}
                disabled={isPaid}
              />
              {errors.clientEmail && <div className="invalid-feedback">{errors.clientEmail}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label">Invoice Date</label>
              <input
                type="date"
                className="form-control"
                value={invoice.date ? new Date(invoice.date).toISOString().split("T")[0] : ""}
                onChange={(e) => updateInvoiceField("date", e.target.value)}
                disabled={isPaid}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className={`form-control ${errors.dueDate ? "is-invalid" : ""}`}
                value={invoice.dueDate ? new Date(invoice.dueDate).toISOString().split("T")[0] : ""}
                onChange={(e) => updateInvoiceField("dueDate", e.target.value)}
                disabled={isPaid}
              />
              {errors.dueDate && <div className="invalid-feedback">{errors.dueDate}</div>}
            </div>

            <div className="col-md-4">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={invoice.status || "Pending"}
                onChange={(e) => updateInvoiceField("status", e.target.value)}
                disabled={isPaid}
              >
                <option value="Pending">Pending</option>
                <option value="Partial">Partial</option>
                <option value="Paid">Paid</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>

            <div className="col-12">
              <label className="form-label">Notes (optional)</label>
              <textarea
                className="form-control"
                rows={3}
                value={invoice.notes || ""}
                onChange={(e) => updateInvoiceField("notes", e.target.value)}
                disabled={isPaid}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Project lines */}
      <div className="card shadow-sm mb-3">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="m-0">Projects / Items</h5>
            <button className="btn btn-sm btn-outline-primary" onClick={addProjectLine} disabled={isPaid}>
              + Add Line
            </button>
          </div>

          {(invoice.projects || []).length === 0 && <p className="text-muted">No lines yet. Add a line above.</p>}

          {(invoice.projects || []).map((p, idx) => (
            <div key={idx} className="row g-2 align-items-center mb-2">
              <div className="col-md-6">
                <input
                  type="text"
                  className={`form-control ${errors[`pname_${idx}`] ? "is-invalid" : ""}`}
                  placeholder="Project / Service name"
                  value={p.projectName || ""}
                  onChange={(e) => updateProjectLine(idx, "projectName", e.target.value)}
                  disabled={isPaid}
                />
                {errors[`pname_${idx}`] && <div className="invalid-feedback">{errors[`pname_${idx}`]}</div>}
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  className={`form-control ${errors[`pamount_${idx}`] ? "is-invalid" : ""}`}
                  placeholder="Amount"
                  value={p.amount}
                  onChange={(e) => updateProjectLine(idx, "amount", e.target.value)}
                  disabled={isPaid}
                />
                {errors[`pamount_${idx}`] && <div className="invalid-feedback">{errors[`pamount_${idx}`]}</div>}
              </div>

              <div className="col-md-2">
                <div className="form-control-plaintext text-end">{formatCurrency(p.amount)}</div>
              </div>

              <div className="col-md-1 text-end">
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => removeProjectLine(idx)}
                  disabled={isPaid}
                  title="Remove line"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}

          <hr />

          <div className="d-flex justify-content-end gap-4">
            <div>
              <div className="text-muted">Subtotal</div>
              <div className="fw-bold">{formatCurrency(totalAmount)}</div>
            </div>

            <div>
              <div className="text-muted">Paid</div>
              <input
                type="number"
                className="form-control"
                value={invoice.paidAmount || 0}
                onChange={(e) => updateInvoiceField("paidAmount", safeNumber(e.target.value))}
                disabled={isPaid}
                style={{ width: 140 }}
              />
            </div>

            <div className="text-end">
              <div className="text-muted">Remaining</div>
              <div className="fw-bold">{formatCurrency(totalAmount - safeNumber(invoice.paidAmount))}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <button className="btn btn-outline-primary me-2" onClick={() => navigate(`/invoice-detail/${invoice._id}`)}>
            Preview Full Invoice
          </button>
        </div>

        <div>
          <button className="btn btn-secondary me-2" onClick={handleSave} disabled={saving || isPaid}>
            {saving ? "Saving…" : "Save Changes"}
          </button>

          <button className="btn btn-success" onClick={handleSendEmail} disabled={sending || isPaid}>
            {sending ? "Sending…" : "Send Invoice Email"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default EditInvoice;
