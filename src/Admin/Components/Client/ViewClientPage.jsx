import { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

function ViewClientPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { leadId } = useParams(); // URL param

  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    leadName: "",
    emailId: "",
    phoneNo: "",
    sourse: "",
    service: "",
    project_type: "",
    project_price: "",
    start_date: "",
    deadline: "",
    startProjectDate: "",
    date: "",
    status: "",
    assign: [],
    userType: "",
    addMember: [],
    _id: "", // important: store MongoDB _id
  });

  // 1️⃣ Fetch client details
  useEffect(() => {
    if (!leadId) return;

    axios
      .get(`http://localhost:5000/api/getClientLeadbyId/${leadId}`)
      .then((res) => {
        const user = res.data.user || res.data;

        setFormData({
          ...user,
          _id: user._id,
          start_date: user.start_date ? user.start_date.split("T")[0] : "",
          deadline: user.deadline ? user.deadline.split("T")[0] : "",
          startProjectDate: user.startProjectDate
            ? user.startProjectDate.split("T")[0]
            : "",
          date: user.date ? user.date.split("T")[0] : "",
          addMember: user.addMember || [],
        });
      })
      .catch((err) => console.log(err));
  }, [leadId]);

  // 2️⃣ Fetch projects using MongoDB _id
  useEffect(() => {
    if (!formData._id) return;

    setLoading(true);

    axios
      .get(`http://localhost:5000/api/getProjectbyClient/${formData._id}`)
      .then((res) => {
        console.log("✅ Projects from API:", res.data);
        setProjects(res.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [formData._id]);

  if (loading) {
    return <div className="text-center mt-5">Loading client data...</div>;
  }

  return (
    <div className="container mt-4">
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
              navigate(`/admin/invoice/${formData._id}`, { state: { client: formData } })
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
            onClick={() =>
              navigate(`/admin/viewinvoice/${formData._id}`, { state: { client: formData } })
            }
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
              <p><strong>Name:</strong> {formData.leadName}</p>
              <p><strong>Email:</strong> {formData.emailId}</p>
              <p><strong>Phone:</strong> {formData.phoneNo}</p>
              <p><strong>Source:</strong> {formData.sourse}</p>
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="col-md-6">
          <div className="card shadow-sm mb-3">
            <div className="card-header fw-bold">Projects</div>
            <div className="card-body">
              {projects.length > 0 ? (
                projects.map((proj) => (
                  <div key={proj._id} className="mb-3 border-bottom pb-2">
                    <p><strong>Project Name:</strong> {proj.projectName}</p>
                    <p>
                      <strong>Assigned To:</strong>{" "}
                      {Array.isArray(proj.addMember) && proj.addMember.length > 0
                        ? proj.addMember
                          .map((m) => m.ename?.replace(/^[, ]+/, "") || "Unknown")
                          .join(", ")
                        : "Unassigned"}
                    </p>
                  </div>
                ))
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
          <p><strong>Status:</strong> {formData.status}</p>
          <p>
            <strong>Assigned To:</strong>{" "}
            {projects.length > 0
              ? projects
                  .flatMap((proj) => proj.addMember || [])
                  .map((m) => m.ename?.replace(/^[, ]+/, "") || "Unknown")
                  .join(", ")
              : "Unassigned"}
          </p>
          <p><strong>User Type:</strong> {formData.userType}</p>
        </div>
      </div>
    </div>
  );
}

export default ViewClientPage;
