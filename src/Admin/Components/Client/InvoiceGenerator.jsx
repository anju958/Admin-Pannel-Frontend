// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useParams, useLocation } from "react-router-dom";
// import { API_URL } from "../../../config";

// // ✅ Improved helper to safely extract the correct project name
// // function getProjectDisplayName(project) {
// //   if (!project || typeof project !== "object") return "Unnamed Project";

// //   // Try all possible naming variations
// //   return (
// //     project.projectName ||
// //     project.project_name ||
// //     project.title ||
// //     project.name ||
// //     project.serviceName ||
// //     (project.service && project.service.serviceName) ||
// //     project.project_type ||
// //     (Array.isArray(project.projectCategory) && project.projectCategory.length
// //       ? project.projectCategory.join(", ")
// //       : undefined) ||
// //     "Unnamed Project"
// //   );
// // }

// function getProjectDisplayName(project) {
//   if (!project || typeof project !== "object") return "Unnamed Project";

//   // Try all known naming possibilities
//   return (
//     project.projectName ||
//     project.project_name ||
//     project.project_title ||
//     project.name ||
//     project.title ||
//     project.projectType ||
//     project.project_type ||
//     project.serviceName ||
//     (project.service && project.service.serviceName) ||
//     (Array.isArray(project.projectCategory) && project.projectCategory.length
//       ? project.projectCategory.join(", ")
//       : undefined) ||
//     "Unnamed Project"
//   );
// }


// function InvoiceGenerator() {
//   const { clientId } = useParams();
//   const location = useLocation();
//   const client = location.state?.client || {};

//   const [projects, setProjects] = useState([]);
//   const [selectedProjects, setSelectedProjects] = useState([]);
//   const [dueDate, setDueDate] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [invoice, setInvoice] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [emailSent, setEmailSent] = useState(false);

//   // ✅ Fetch client projects
//   // useEffect(() => {
//   //   if (!clientId) return;
//   //   axios
//   //     .get(`${API_URL}/api/getProjectbyClient/${clientId}`)
//   //     .then((res) => {
//   //       console.log("Fetched Projects:", res.data); // Debugging helper
//   //       setProjects(res.data || []);
//   //     })
//   //     .catch(() =>
//   //       setErrors((e) => ({
//   //         ...e,
//   //         fetchProjects: "Failed to load projects.",
//   //       }))
//   //     );
//   // }, [clientId]);

//   useEffect(() => {
//   if (!clientId) return;
//   axios.get(`${API_URL}/api/getProjectbyClient/${clientId}`)
//     .then((res) => {
//       console.log("✅ Project Data from Backend:", res.data);
//       setProjects(res.data || []);
//     })
//     .catch(() => setErrors((e) => ({ ...e, fetchProjects: "Failed to load projects." })));
// }, [clientId]);

//   const handleToggle = (projectId) => {
//     setErrors({});
//     setSelectedProjects((prev) =>
//       prev.includes(projectId)
//         ? prev.filter((id) => id !== projectId)
//         : [...prev, projectId]
//     );
//   };

//   // ✅ Validate before generating invoice
//   const validateForm = () => {
//     const e = {};
//     if (!client?.emailId) e.clientEmail = "Client email is required.";
//     if (!dueDate) e.dueDate = "Due date is required.";
//     if (!selectedProjects.length) e.projects = "Select at least one project.";
//     setErrors(e);
//     return Object.keys(e).length === 0;
//   };

//   // ✅ Generate invoice
//   const handleGenerateInvoice = async () => {
//     if (!validateForm()) return;
//     setLoading(true);
//     setEmailSent(false);

//     // Prepare project payload
//     const payloadProjects = selectedProjects.map((id) => {
//       const proj = projects.find((p) => p._id === id);
//       return {
//         projectId: id,
//         amount: Number(proj?.project_price || proj?.price || proj?.amount || 0),
//         projectName: getProjectDisplayName(proj),
//       };
//     });

//     try {
//       const res = await axios.post(`${API_URL}/api/createInvoice`, {
//         clientId,
//         clientName: client.leadName,
//         clientEmail: client.emailId,
//         projects: payloadProjects,
//         dueDate,
//       });

//       const created = res.data.invoice || res.data;
//       setInvoice(created);
//       setSelectedProjects([]);
//       setDueDate("");
//       setEmailSent(true);
//     } catch (err) {
//       console.error("Invoice creation error:", err);
//       alert("Failed to create invoice.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Resend invoice email
//   const handleResendEmail = async () => {
//     if (!invoice) return;
//     try {
//       setLoading(true);
//       await axios.post(`${API_URL}/api/sendInvoice/${invoice._id}`);
//       setEmailSent(true);
//       alert("Email resent successfully.");
//     } catch (err) {
//       console.error("Email resend failed:", err);
//       setEmailSent(false);
//       alert("Failed to resend email.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ Calculate total selected amount
//   const totalAmount = selectedProjects.reduce((sum, id) => {
//     const proj = projects.find((p) => p._id === id);
//     return sum + (Number(proj?.price) || Number(proj?.project_price) || 0);
//   }, 0);

//   const minDate = new Date().toISOString().split("T")[0];

//   return (
//     <div className="container mt-4" style={{ maxWidth: "700px" }}>
//       <h2 className="mb-4 text-center">Generate Invoice</h2>

//       {/* Client Info */}
//       <div className="mb-2">
//         <strong>Client:</strong> {client?.leadName || "Unknown"}
//       </div>
//       <div className="mb-2">
//         <strong>Client Email:</strong>{" "}
//         {client?.emailId || <span className="text-danger">missing</span>}
//       </div>
//       {errors.clientEmail && (
//         <div className="text-danger mb-2">{errors.clientEmail}</div>
//       )}

//       {/* Due Date */}
//       <div className="mb-3">
//         <label className="form-label">Due Date:</label>
//         <input
//           type="date"
//           className="form-control w-50"
//           value={dueDate}
//           min={minDate}
//           onChange={(e) => {
//             setDueDate(e.target.value);
//             setErrors((s) => ({ ...s, dueDate: undefined }));
//           }}
//         />
//         {errors.dueDate && <div className="text-danger">{errors.dueDate}</div>}
//       </div>

//       {/* Projects Selection */}
//       <h5>Select Projects for Invoice:</h5>
//       {errors.fetchProjects && (
//         <div className="text-danger">{errors.fetchProjects}</div>
//       )}
//       {projects.length === 0 && <p className="text-muted">No projects found.</p>}
//       <ul className="list-group mb-3">
//         {projects.map((project) => (
//           <li
//             key={project._id}
//             className="list-group-item d-flex justify-content-between align-items-center"
//           >
//             <div>
//               <input
//                 type="checkbox"
//                 checked={selectedProjects.includes(project._id)}
//                 onChange={() => handleToggle(project._id)}
//                 className="me-2"
//               />
//               <strong>{getProjectDisplayName(project)}</strong>
//               <div className="small text-muted">
//                 {project.department?.deptName} • {project.service?.serviceName}
//               </div>
//             </div>
//             <div>₹{Number(project.price || 0).toLocaleString()}</div>
//           </li>
//         ))}
//       </ul>
//       {errors.projects && (
//         <div className="text-danger mb-2">{errors.projects}</div>
//       )}

//       {/* Total */}
//       <div className="mb-3">
//         <strong>Total Selected Amount:</strong> ₹{totalAmount.toLocaleString()}
//       </div>

//       {/* Generate Button */}
//       <button
//         className="btn btn-primary w-100 mb-4"
//         onClick={handleGenerateInvoice}
//         disabled={loading}
//       >
//         {loading ? "Generating..." : "Generate Invoice"}
//       </button>

//       {/* Invoice Display */}
//       {invoice && (
//         <div className="p-4 border rounded shadow-sm bg-light">
//           <h4 className="mb-3">Invoice Generated</h4>
//           <p>
//             <strong>Invoice Number:</strong> {invoice.invoiceNumber}
//           </p>
//           <p>
//             <strong>Client:</strong> {client?.leadName}
//           </p>
//           <p>
//             <strong>Due Date:</strong>{" "}
//             {new Date(invoice.dueDate).toLocaleDateString()}
//           </p>
//           <p>
//             <strong>Status:</strong> {invoice.status}
//           </p>
//           <p>
//             <strong>Total Amount:</strong> ₹
//             {invoice.projects
//               .reduce((sum, p) => sum + Number(p.amount), 0)
//               .toLocaleString()}
//           </p>

//           <h5 className="mt-3">Projects Invoiced:</h5>
//           <ul className="list-group">
//             {invoice.projects.map((p, i) => (
//               <li
//                 key={p.projectId || p._id || i}
//                 className="list-group-item d-flex justify-content-between"
//               >
//                 <span>
//                   {getProjectDisplayName(p) || p.projectName || "Unnamed Project"}
//                 </span>
//                 <span>₹{Number(p.amount).toLocaleString()}</span>
//               </li>
//             ))}
//           </ul>

//           <div className="mt-3 d-flex align-items-center">
//             {emailSent ? (
//               <span className="badge bg-success me-2">Email Sent ✔️</span>
//             ) : (
//               <span className="badge bg-warning text-dark me-2">
//                 Email Not Sent
//               </span>
//             )}
//             {!emailSent && (
//               <button
//                 className="btn btn-sm btn-outline-primary"
//                 onClick={handleResendEmail}
//                 disabled={loading}
//               >
//                 Resend Email
//               </button>
//             )}
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// export default InvoiceGenerator;

import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { API_URL } from "../../../config";

// ✅ Smarter helper to show project name correctly
function getProjectDisplayName(project) {
  if (!project || typeof project !== "object") return "Unnamed Project";

  return (
    project.projectName ||
    project.project_name ||
    project.project_title ||
    project.name ||
    project.title ||
    project.projectType ||
    project.project_type ||
    project.serviceName ||
    (project.service && project.service.serviceName) ||
    (Array.isArray(project.projectCategory) && project.projectCategory.length
      ? project.projectCategory.join(", ")
      : undefined) ||
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

  // ✅ Fetch projects
  useEffect(() => {
    if (!clientId) return;
    axios
      .get(`${API_URL}/api/getProjectbyClient/${clientId}`)
      .then((res) => {
        console.log("✅ Project Data from Backend:", res.data);
        setProjects(res.data || []);
      })
      .catch(() =>
        setErrors((e) => ({ ...e, fetchProjects: "Failed to load projects." }))
      );
  }, [clientId]);

  // ✅ Toggle project selection
  const handleToggle = (projectId) => {
    setErrors({});
    setSelectedProjects((prev) =>
      prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [...prev, projectId]
    );
  };

  // ✅ Validation
  const validateForm = () => {
    const e = {};
    if (!client?.emailId) e.clientEmail = "Client email is required.";
    if (!dueDate) e.dueDate = "Due date is required.";
    if (!selectedProjects.length) e.projects = "Select at least one project.";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ✅ Generate Invoice
  const handleGenerateInvoice = async () => {
    if (!validateForm()) return;
    setLoading(true);
    setEmailSent(false);

    const payloadProjects = selectedProjects.map((id) => {
      const proj = projects.find((p) => p._id === id);
      return {
        projectId: id,
        amount: Number(proj.project_price || proj.price || proj.amount || 0),
        projectName: getProjectDisplayName(proj),
      };
    });

    try {
      const res = await axios.post(`${API_URL}/api/createInvoice`, {
        clientId,
        clientName: client.leadName,
        clientEmail: client.emailId,
        projects: payloadProjects,
        dueDate,
      });
      const created = res.data.invoice || res.data;
      setInvoice(created);
      setSelectedProjects([]);
      setDueDate("");
      setEmailSent(true);
    } catch {
      alert("Failed to create invoice.");
    }
    setLoading(false);
  };

  // ✅ Resend Email
  const handleResendEmail = async () => {
    if (!invoice) return;
    try {
      setLoading(true);
      await axios.post(`${API_URL}/api/sendInvoice/${invoice._id}`);
      setEmailSent(true);
      alert("Email resent successfully.");
    } catch {
      setEmailSent(false);
      alert("Failed to resend email.");
    } finally {
      setLoading(false);
    }
  };

  const totalAmount = selectedProjects.reduce((sum, id) => {
    const proj = projects.find((p) => p._id === id);
    return sum + (Number(proj?.price || proj?.project_price || proj?.amount) || 0);
  }, 0);

  const minDate = new Date().toISOString().split("T")[0];

  return (
    <div className="container mt-4" style={{ maxWidth: "700px" }}>
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

      <div className="mb-3">
        <strong>Total Selected Amount:</strong> ₹{totalAmount.toLocaleString()}
      </div>

      <button
        className="btn btn-primary w-100 mb-4"
        onClick={handleGenerateInvoice}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate Invoice"}
      </button>

      {invoice && (
        <div className="p-4 border rounded shadow-sm bg-light">
          <h4 className="mb-3">Invoice Generated</h4>
          <p>
            <strong>Invoice Number:</strong> {invoice.invoiceNumber}
          </p>
          <p>
            <strong>Client:</strong> {client?.leadName}
          </p>
          <p>
            <strong>Due Date:</strong>{" "}
            {new Date(invoice.dueDate).toLocaleDateString()}
          </p>
          <p>
            <strong>Status:</strong> {invoice.status}
          </p>
          <p>
            <strong>Total Amount:</strong> ₹
            {invoice.projects
              .reduce((sum, p) => sum + Number(p.amount), 0)
              .toLocaleString()}
          </p>

          <h5 className="mt-3">Projects Invoiced:</h5>
          <ul className="list-group">
            {invoice.projects.map((p) => (
              <li
                key={p.projectId || p._id || p.projectName || p.amount}
                className="list-group-item d-flex justify-content-between"
              >
                <span>
                  {getProjectDisplayName(p) || p.projectName || "Unnamed Project"}
                </span>
                <span>₹{Number(p.amount).toLocaleString()}</span>
              </li>
            ))}
          </ul>

          <div className="mt-3 d-flex align-items-center">
            {emailSent ? (
              <span className="badge bg-success me-2">Email Sent ✔️</span>
            ) : (
              <span className="badge bg-warning text-dark me-2">
                Email Not Sent
              </span>
            )}
            {!emailSent && (
              <button
                className="btn btn-sm btn-outline-primary"
                onClick={handleResendEmail}
                disabled={loading}
              >
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
