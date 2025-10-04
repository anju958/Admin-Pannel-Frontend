
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { API_URL } from "../../../config";

function InvoiceGenerator() {
  const { clientId } = useParams();
  const location = useLocation();
  const client = location.state?.client || {};

  const [projects, setProjects] = useState([]);
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [invoice, setInvoice] = useState(null);
  const [errors, setErrors] = useState({});
  const [emailSent, setEmailSent] = useState(false);

  useEffect(() => {
    if (!clientId) return;

    axios
      .get(`${API_URL}/api/getProjectbyClient/${clientId}`)
      .then((res) => setProjects(res.data || []))
      .catch((err) => {
        console.error("Failed to fetch projects:", err);
        setErrors((e) => ({ ...e, fetchProjects: "Failed to load projects." }));
      });
  }, [clientId]);

  const handleToggle = (projectId) => {
    setErrors({});
    setSelectedProjects((prev) =>
      prev.includes(projectId) ? prev.filter((id) => id !== projectId) : [...prev, projectId]
    );
  };

  const validateForm = () => {
    const e = {};
    const email = (client?.emailId || "").trim();
    if (!email) e.clientEmail = "Client email is required to send invoice and payment link.";
    else if (!/^\S+@\S+\.\S+$/.test(email)) e.clientEmail = "Client email format looks invalid.";

    if (!dueDate) e.dueDate = "Due date is required.";
    else {
      const selectedDate = new Date(dueDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today) e.dueDate = "Due date cannot be in the past.";
    }

    if (!selectedProjects || selectedProjects.length === 0) e.projects = "Please select at least one project.";

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleGenerateInvoice = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setEmailSent(false);

    try {
      const payloadProjects = selectedProjects.map((id) => {
        const proj = projects.find((p) => p._id === id);
        return { projectId: id, amount: Number(proj.price) || 0, projectName: proj.projectName };
      });

      // 1️⃣ Create invoice in backend
      const res = await axios.post(`${API_URL}/api/createInvoice/${clientId}`, {
        projects: payloadProjects,
        dueDate,
        clientEmail: client?.emailId,
      });

      const created = res.data?.invoice || res.data;
      setInvoice(created);

      // 2️⃣ Send invoice email using your existing API
      try {
        await axios.post(`${API_URL}/api/sendInvoice/${created._id}`);
        setEmailSent(true);
      } catch (err) {
        console.error("Failed to send invoice email:", err);
        setEmailSent(false);
      }

      setSelectedProjects([]);
      setDueDate("");
    } catch (err) {
      console.error("Failed to generate invoice:", err);
      alert(err.response?.data?.error || "Failed to generate invoice. See console.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
  if (!invoice) return;
  try {
    setLoading(true);
    await axios.post(`${API_URL}/api/sendInvoice/${invoice._id}`);
    setEmailSent(true);
    alert("Email resent successfully!");
  } catch (err) {
    console.error("Failed to resend invoice email:", err);
    setEmailSent(false);
    alert("Failed to resend email.");
  } finally {
    setLoading(false);
  }
};

  const totalAmount = selectedProjects.reduce((sum, id) => {
    const proj = projects.find((p) => p._id === id);
    return sum + (Number(proj?.price) || 0);
  }, 0);

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
      <h2 className="mb-4 text-center">Generate Invoice</h2>
      <div className="mb-2"><strong>Client:</strong> {client?.leadName || "Unknown"}</div>
      <div className="mb-2"><strong>Client Email:</strong> {client?.emailId || <span className="text-danger">missing</span>}</div>
      {errors.clientEmail && <div className="text-danger mb-2">{errors.clientEmail}</div>}

      <div className="mb-3">
        <label className="form-label">Due Date:</label>
        <input
          type="date"
          className="form-control w-50"
          value={dueDate}
          min={minDate}
          onChange={(e) => {
            setDueDate(e.target.value);
            setErrors((s) => ({ ...s, dueDate: undefined }));
          }}
        />
        {errors.dueDate && <div className="text-danger">{errors.dueDate}</div>}
      </div>

      <h5>Select Projects for Invoice:</h5>
      {errors.fetchProjects && <div className="text-danger">{errors.fetchProjects}</div>}
      {projects.length === 0 && <p className="text-muted">No projects found.</p>}
      <ul className="list-group mb-3">
        {projects.map((project) => (
          <li key={project._id} className="list-group-item d-flex justify-content-between align-items-center">
            <div>
              <input
                type="checkbox"
                checked={selectedProjects.includes(project._id)}
                onChange={() => handleToggle(project._id)}
                className="me-2"
              />
              <strong>{project.projectName}</strong>
              <div className="small text-muted">{project.department?.deptName} • {project.service?.serviceName}</div>
            </div>
            <div>₹{Number(project.price || 0).toLocaleString()}</div>
          </li>
        ))}
      </ul>
      {errors.projects && <div className="text-danger mb-2">{errors.projects}</div>}

      <div className="mb-3"><strong>Total Selected Amount:</strong> ₹{totalAmount.toLocaleString()}</div>

      <button className="btn btn-primary w-100 mb-4" onClick={handleGenerateInvoice} disabled={loading}>
        {loading ? "Generating..." : "Generate Invoice"}
      </button>

      {invoice && (
        <div className="p-4 border rounded shadow-sm bg-light">
          <h4 className="mb-3">Invoice Generated</h4>
          <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Client:</strong> {client?.leadName}</p>
          <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p><strong>Status:</strong> {invoice.status}</p>
          <p><strong>Total Amount:</strong> ₹{invoice.projects.reduce((sum, p) => sum + Number(p.amount), 0).toLocaleString()}</p>

          <h5 className="mt-3">Projects Invoiced:</h5>
          <ul className="list-group">
            {invoice.projects.map((p) => (
              <li key={p.projectId} className="list-group-item d-flex justify-content-between">
                <span>{projects.find((pr) => pr._id === p.projectId)?.projectName || p.projectName || p.projectId}</span>
                <span>₹{Number(p.amount).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 d-flex align-items-center">
            {emailSent ? (
              <span className="badge bg-success me-2">Email Sent ✔️</span>
            ) : (
              <span className="badge bg-warning text-dark me-2">Email Not Sent</span>
            )}
            {!emailSent && (
              <button className="btn btn-sm btn-outline-primary" onClick={handleResendEmail} disabled={loading}>
                Resend Email
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default InvoiceGenerator;
