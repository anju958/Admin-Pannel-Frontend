import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

function ViewLeadPage() {
  const { leadId } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [leadData, setLeadData] = useState({
    leadName: "",
    emailId: "",
    phoneNo: "",
    sourse: "",
    date: "",
    status: "",
    _id: "",
  });

  // Fetch lead details
  useEffect(() => {
    if (!leadId) return;

    axios
      .get(`http://localhost:5000/api/leadById/${leadId}`)
      .then((res) => {
        const lead = res.data.lead || res.data;
        setLeadData({
          ...lead,
          _id: lead._id,
          date: lead.date ? lead.date.split("T")[0] : "",
        });
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, [leadId]);

  if (loading) {
    return <div className="text-center mt-5">Loading lead data...</div>;
  }

  return (
    <div className="container mt-4">
      <h3 className="text-center mb-4">Lead Details</h3>

      {/* Actions */}
      <div className="card shadow-sm mb-4">
        <div className="card-header fw-bold">Actions</div>
        <div className="card-body">
          <button
            className="btn btn-primary"
            onClick={() =>
              navigate("/admin/addproposal", { state: { client: leadData } })
            }
          >
            📄 Add Proposal
          </button>
        </div>
      </div>

      {/* Lead Info */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Lead Information</div>
        <div className="card-body">
          <p><strong>Name:</strong> {leadData.leadName}</p>
          <p><strong>Email:</strong> {leadData.emailId}</p>
          <p><strong>Phone:</strong> {leadData.phoneNo}</p>
          <p><strong>Source:</strong> {leadData.sourse}</p>
          <p><strong>Date:</strong> {leadData.date}</p>
          <p><strong>Status:</strong> {leadData.status}</p>
        </div>
      </div>
    </div>
  );
}

export default ViewLeadPage;
