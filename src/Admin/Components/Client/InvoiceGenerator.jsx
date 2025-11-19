import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { API_URL } from "../../../config";

// For project selection list only
function getProjectDisplayName(project) {
  if (!project || typeof project !== "object") return "Unnamed Project";
  return (
    project.projectName ||
    project.name ||
    project.project_title ||
    project.project_name ||
    project.title ||
    project.projectType ||
    project.project_type ||
    project.serviceName ||
    project.project ||
    (project.service && project.service.serviceName) ||
    (typeof project.service === "string" && project.service) ||
    (Array.isArray(project.projectCategory) && project.projectCategory.length
      ? project.projectCategory.join(", ")
      : undefined) ||
    String(project) ||
    "Unnamed Project"
  );
}

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
  const [showPreview, setShowPreview] = useState(false);
  const [creatorEmail, setCreatorEmail] = useState("");

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData?.email) setCreatorEmail(userData.email);
  }, []);

  useEffect(() => {
    if (!clientId) return;
    axios
      .get(`${API_URL}/api/getProjectbyClient/${clientId}`)
      .then((res) => setProjects(res.data || []))
      .catch(() =>
        setErrors((e) => ({ ...e, fetchProjects: "Failed to load projects." }))
      );
  }, [clientId]);

  const handleToggle = (projectId) => {
    setErrors({});
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  const handleGenerateInvoice = () => {
    const e = {};
    if (!client?.emailId) e.clientEmail = "Client email is required.";
    if (!dueDate) e.dueDate = "Due date is required.";
    if (!selectedProjects.length) e.projects = "Select at least one project.";
    setErrors(e);
    if (Object.keys(e).length > 0) {
      alert("Please fill all required fields before previewing the invoice.");
      return;
    }

    const payloadProjects = selectedProjects.map((id) => {
      const proj = projects.find((p) => `${p._id}` === `${id}`);
      return {
        projectId: id,
        amount: Number(proj?.project_price || proj?.price || proj?.amount || 0),
        projectName: getProjectDisplayName(proj)
      };
    });

    setInvoice({
      clientId,
      clientName: client?.leadName || "Unnamed Client",
      clientEmail: client?.emailId,
      projects: payloadProjects,
      dueDate,
      createdBy: creatorEmail || "admin@example.com",
    });

    setShowPreview(true);
  };

  const handleConfirmAndSend = async () => {
    if (!invoice) return;
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/api/createInvoice`, {
        ...invoice,
        sendNow: true
      });
      const created = res.data.invoice || res.data;
      setInvoice(created);
      setEmailSent(true);
      setShowPreview(false);
      alert("✅ Invoice created and sent successfully!");
    } catch {
      alert("❌ Failed to send invoice.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!invoice) return;
    setLoading(true);
    try {
      await axios.post(`${API_URL}/api/sendInvoice/${invoice._id}`);
      setEmailSent(true);
      alert("📧 Invoice email sent successfully!");
    } catch {
      setEmailSent(false);
      alert("❌ Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedProjects.reduce((sum, id) => {
    const proj = projects.find((p) => `${p._id}` === `${id}`);
    return sum + (Number(proj?.price || proj?.project_price || proj?.amount) || 0);
  }, 0);

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-4" style={{ maxWidth: "750px" }}>
      <h2 className="mb-4 text-center">Generate Invoice</h2>
      <div className="mb-2">
        <strong>Client:</strong> {client?.leadName || "Unknown"}
      </div>
      <div className="mb-2">
        <strong>Client Email:</strong>{" "}
        {client?.emailId || <span className="text-danger">missing</span>}
      </div>
      {errors.clientEmail && (
        <div className="text-danger mb-2">{errors.clientEmail}</div>
      )}
      <div className="mb-3">
        <label className="form-label fw-bold">Due Date:</label>
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
      <h5 className="mt-3">Select Projects:</h5>
      {errors.fetchProjects && (
        <div className="text-danger">{errors.fetchProjects}</div>
      )}
      {projects.length === 0 && <p className="text-muted">No projects found.</p>}
      <ul className="list-group mb-3">
        {projects.map((project) => (
          <li
            key={project._id}
            className="list-group-item d-flex justify-content-between align-items-center"
          >
            <div>
              <input
                type="checkbox"
                checked={selectedProjects.includes(project._id)}
                onChange={() => handleToggle(project._id)}
                className="me-2"
              />
              <strong>{getProjectDisplayName(project)}</strong>
              <div className="small text-muted">
                {project.department?.deptName} • {project.service?.serviceName}
              </div>
            </div>
            <div>
              ₹{Number(project.price || project.project_price || 0).toLocaleString()}
            </div>
          </li>
        ))}
      </ul>
      {errors.projects && (
        <div className="text-danger mb-2">{errors.projects}</div>
      )}
      <div className="mb-3 fw-bold">
        Total Selected: ₹{totalAmount.toLocaleString()}
      </div>
      <button
        className="btn btn-primary w-100 mb-4"
        onClick={handleGenerateInvoice}
        disabled={loading}
      >
        {loading ? "Preparing Preview..." : "Preview Invoice"}
      </button>
      {/* Preview Modal */}
      {showPreview && invoice && (
        <div
          className="modal show fade d-block"
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">🧾 Invoice Preview</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPreview(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p><strong>Client:</strong> {invoice.clientName}</p>
                <p><strong>Email:</strong> {invoice.clientEmail}</p>
                <p><strong>Due Date:</strong> {invoice.dueDate}</p>
                <p><strong>Created By:</strong> {invoice.createdBy}</p>
                <hr />
                <h6>Projects:</h6>
                <ul className="list-group mb-3">
                  {invoice.projects.map((p, i) => (
                    <li
                      key={i}
                      className="list-group-item d-flex justify-content-between align-items-center"
                    >
                      <span>{p.projectName || "Unnamed Project"}</span>
                      <input
                        type="number"
                        className="form-control form-control-sm w-25 text-end"
                        value={p.amount}
                        onChange={(e) => {
                          const newProjects = [...invoice.projects];
                          newProjects[i].amount = Number(e.target.value);
                          setInvoice({ ...invoice, projects: newProjects });
                        }}
                      />
                    </li>
                  ))}
                </ul>
                <div className="fw-bold text-end">
                  Total: ₹
                  {invoice.projects
                    .reduce((sum, p) => sum + Number(p.amount), 0)
                    .toLocaleString()}
                </div>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowPreview(false)}
                >
                  ✏️ Edit Again
                </button>
                <button
                  className="btn btn-success"
                  onClick={handleConfirmAndSend}
                  disabled={loading}
                >
                  {loading ? "Sending..." : "✅ Confirm & Send"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* After Invoice Created */}
      {invoice && invoice._id && (
        <div className="p-4 border rounded shadow-sm bg-light mt-3">
          <h4 className="mb-3">✅ Invoice Created</h4>
          <p><strong>Invoice Number:</strong> {invoice.invoiceNumber}</p>
          <p><strong>Client:</strong> {invoice.clientName}</p>
          <p><strong>Created By:</strong> {invoice.createdBy || creatorEmail}</p>
          <p><strong>Due Date:</strong> {new Date(invoice.dueDate).toLocaleDateString()}</p>
          <p>
            <strong>Status:</strong>{" "}
            {emailSent ? (
              <span className="badge bg-success">Sent</span>
            ) : (
              <span className="badge bg-warning text-dark">{invoice.status || "Draft"}</span>
            )}
          </p>
          <p>
            <strong>Total:</strong> ₹
            {invoice.projects
              .reduce((sum, p) => sum + Number(p.amount), 0)
              .toLocaleString()}
          </p>
          <h6 className="mt-3">Projects:</h6>
          <ul className="list-group mb-3">
            {invoice.projects.map((p, i) => (
              <li key={i} className="list-group-item d-flex justify-content-between">
                <span>{p.projectName || "Unnamed Project"}</span>
                <span>₹{Number(p.amount).toLocaleString()}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 d-flex align-items-center">
            {emailSent ? (
              <span className="badge bg-success me-2">Email Sent ✔️</span>
            ) : (
              <>
                <span className="badge bg-warning text-dark me-2">
                  Email Not Sent
                </span>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={handleResendEmail}
                  disabled={loading}
                >
                  Send Invoice Email
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default InvoiceGenerator;
