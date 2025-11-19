
import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

function ViewClientPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { leadId } = useParams();

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    leadName: "",
    emailId: "",
    phoneNo: "",
    sourse: "",
    status: "",
    userType: "",
    _id: "",
  });
  const [invoices, setInvoices] = useState([]); // New: store invoices

  // ✅ Fetch client details
  useEffect(() => {
    if (!leadId) return;
    axios
      .get(`${API_URL}/api/getClientLeadbyId/${leadId}`)
      .then((res) => {
        const user = res.data.user || res.data;
        setFormData({
          ...user,
          _id: user._id,
        });
      })
      .catch((err) => console.log(err));
  }, [leadId]);

  // ✅ Fetch projects for this client
  useEffect(() => {
    if (!formData._id) return;
    setLoading(true);
    axios
      .get(`${API_URL}/api/getProjectbyClient/${formData._id}`)
      .then((res) => {
        setProjects(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
      });
  }, [formData._id]);

  useEffect(() => {
  if (!formData._id) return;
  axios
    .get(`${API_URL}/api/getInvoicesByClient/${formData._id}`)
    .then((res) => {
      if (res.data && res.data.success) {
        setInvoices(res.data.invoices);
        console.log("Client _id:", formData._id);
        console.log("Fetched client invoices:", res.data.invoices);
      } else {
        setInvoices([]);
      }
    })
    .catch(() => setInvoices([]));
}, [formData._id]);


  if (loading) {
    return <div className="text-center mt-5">Loading client data...</div>;
  }

  return (
    <div className="container mt-4">
      {/* 🔙 Back Button */}
      <div className="mb-3">
        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
      </div>

      <h3 className="text-center mb-4">Client Details</h3>

      {/* Actions */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Actions</div>
        <div className="card-body d-flex flex-wrap gap-2">
          <button
            className="btn btn-success"
            onClick={() =>
              navigate(`/admin/addProject/${formData._id}`, {
                state: { client: formData },
              })
            }
          >
            ➕ Add Project
          </button>

          <button
            className="btn btn-warning"
            onClick={() =>
              navigate(`/admin/invoice/${formData._id}`, {
                state: { client: formData },
              })
            }
          >
            🧾 Invoice
          </button>

          <button
            className="btn btn-info"
            onClick={() =>
              navigate("/admin/projects", { state: { client: formData } })
            }
          >
            📂 View Projects
          </button>

          <button
  className="btn btn-secondary"
  disabled={!formData._id}
  onClick={() => navigate(`/admin/clientInvoicesList/${formData._id}`)}
>
  👁️ View Invoice
</button>
        </div>
      </div>

      <div className="row">
        {/* Personal Details */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-3">
            <div className="card-header fw-bold">Personal Details</div>
            <div className="card-body">
              <p>
                <strong>Name:</strong> {formData.leadName}
              </p>
              <p>
                <strong>Email:</strong> {formData.emailId}
              </p>
              <p>
                <strong>Phone:</strong> {formData.phoneNo}
              </p>
              <p>
                <strong>Source:</strong> {formData.sourse}
              </p>
            </div>
          </div>
        </div>

        {/* Projects Section */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-3">
            <div className="card-header fw-bold">Projects</div>
            <div className="card-body">
              {projects.length > 0 ? (
                <>
                  {projects.map((proj) => (
                    <div key={proj._id} className="mb-3 border-bottom pb-2">
                      <p>
                        <strong>Project Name:</strong> {proj.projectName}
                      </p>
                      <p>
                        <strong>Price:</strong> ₹
                        {proj.project_price || proj.price || "N/A"}
                      </p>
                      <p>
                        <strong>Service:</strong>{" "}
                        {proj.service?.serviceName || "N/A"}
                      </p>
                      <p>
                        <strong>Assigned To:</strong>{" "}
                        {Array.isArray(proj.addMember) &&
                        proj.addMember.length > 0
                          ? proj.addMember
                              .map(
                                (m) =>
                                  m.ename?.replace(/^[, ]+/, "") || "Unknown"
                              )
                              .join(", ")
                          : "Unassigned"}
                      </p>
                    </div>
                  ))}
                </>
              ) : (
                <p className="text-muted">No project added yet.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Status & Assignment */}
      <div className="card shadow-sm mb-3">
        <div className="card-header fw-bold">Status & Assignment</div>
        <div className="card-body">
          <p>
            <strong>Status:</strong> {formData.status}
          </p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {projects.length > 0
              ? projects
                  .flatMap((proj) => proj.addMember || [])
                  .map((m) => m.ename?.replace(/^[, ]+/, "") || "Unknown")
                  .join(", ")
              : "Unassigned"}
          </p>
          <p>
            <strong>User Type:</strong> {formData.userType}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ViewClientPage;
