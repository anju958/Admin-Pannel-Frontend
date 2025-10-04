
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";


function EditProposal() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    terms: "",
    status: "Pending",
    services: [],
    category: [],
    attachments: [],
    clientId: { leadName: "", emailId: "", phoneNo: "" }, 
  });

  const [newFiles, setNewFiles] = useState([]);

  // Fetch proposal by ID
  useEffect(() => {
    const fetchProposal = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/getProposalById/${id}`);
        // Map backend client fields correctly
        const data = res.data;
        setFormData({
          ...data,
          clientId: {
            leadName: data.clientId?.leadName || "",
            emailId: data.clientId?.emailId || "",
            phoneNo: data.clientId?.phoneNo || "",
          },
        });
      } catch (err) {
        console.error("Error fetching proposal:", err);
      }
    };
    fetchProposal();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData((prev) => ({ ...prev, services: updatedServices }));
  };

  const handleFileChange = (e) => {
    setNewFiles([...e.target.files]);
  };

  const totalPrice = formData.services?.reduce((acc, s) => acc + (s.price || 0), 0);

  const handleSave = async () => {
    try {
      const data = new FormData();
      data.append("title", formData.title);
      data.append("description", formData.description);
      data.append("terms", formData.terms);
      data.append("status", "Sent"); // mark sent automatically
      data.append("services", JSON.stringify(formData.services));
      data.append("category", JSON.stringify(formData.category));

      // Existing attachments
      formData.attachments.forEach((file) => data.append("existingAttachments[]", file));

      // New files
      newFiles.forEach((file) => data.append("attachments", file));

      await axios.put(`${API_URL}/api/UpdateProposal/${id}`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Proposal updated & sent!");
      navigate("/admin/PurposalList");
    } catch (err) {
      console.error("Error updating proposal:", err);
      alert("Failed to update proposal. Check console.");
    }
  };

  return (
    <div className="container mt-4">
      <h2>✏️ Edit Proposal</h2>
      <div className="card shadow p-4 mt-3">
        <form>
          {/* Client Info */}
          <div className="mb-3">
            <label className="form-label">Client Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.clientId?.leadName || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={formData.clientId?.emailId || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input
              type="text"
              className="form-control"
              value={formData.clientId?.phoneNo || ""}
              readOnly
            />
          </div>

          {/* Proposal Info */}
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Services</label>
            {formData.services?.map((s, index) => (
              <div key={index} className="mb-2 d-flex gap-2">
                <input
                  type="text"
                  value={s.name || ""}
                  onChange={(e) => handleServiceChange(index, "name", e.target.value)}
                  className="form-control"
                  placeholder="Service Name"
                />
                <input
                  type="number"
                  value={s.price || ""}
                  onChange={(e) => handleServiceChange(index, "price", Number(e.target.value))}
                  className="form-control"
                  placeholder="Price"
                />
              </div>
            ))}
            <strong>Total Price: ₹{totalPrice}</strong>
          </div>

          <div className="mb-3">
            <label className="form-label">Terms</label>
            <input
              type="text"
              name="terms"
              className="form-control"
              value={formData.terms || ""}
              onChange={handleChange}
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Status</label>
            <select
              name="status"
              className="form-select"
              value={formData.status || "Pending"}
              onChange={handleChange}
            >
              <option value="Sent">Send</option>
              <option value="Draft">Draft</option>
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Upload Files</label>
            <input type="file" multiple className="form-control" onChange={handleFileChange} />
            {formData.attachments?.length > 0 && (
              <div className="mt-2">
                <strong>Existing files:</strong> {formData.attachments.join(", ")}
              </div>
            )}
          </div>

          <button type="button" className="btn btn-secondary me-2" onClick={() => navigate("/admin/ProposalList")}>
            ❌ Cancel
          </button>
          <button type="button" className="btn btn-primary" onClick={handleSave}>
            💾 Save & Send
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditProposal;
