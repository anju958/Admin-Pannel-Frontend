
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";

function Proposal() {
  const proposalRef = useRef();
  const location = useLocation();
  const navigate = useNavigate();
  const clientData = location.state?.client;

  const [loading, setLoading] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const [services, setServices] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [categories, setCategories] = useState([
    { value: "Laravel", label: "Laravel" },
    { value: "Vuejs", label: "Vuejs" },
    { value: "React", label: "React" },
    { value: "Zend", label: "Zend" },
    { value: "CakePhp", label: "CakePhp" },
  ]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const [proposal, setProposal] = useState({
    title: "",
    services: [],
    description: "",
    category: [],
    terms: "",
    file: null,
  });

  useEffect(() => {
    if (!clientData?._id) {
      alert("Client data missing! Go back and select a client.");
      navigate(-1);
    }
  }, [clientData, navigate]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/getServices")
      .then((res) => {
        const options = res.data.map((service) => ({
          value: service._id,
          label: service.serviceName,
          price: service.servicePrice,
        }));
        setServices(options);
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    setProposal((prev) => ({
      ...prev,
      category: selectedCategories.map((c) => c.label),
    }));
  }, [selectedCategories]);

  const handleProposalChange = (e) => {
    setProposal({ ...proposal, [e.target.name]: e.target.value });
  };

  const handleSaveAndSendProposal = async () => {
    if (!clientData?._id) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("clientId", clientData._id);
      formData.append("title", proposal.title);
      formData.append("services", JSON.stringify(proposal.services));
      formData.append("description", proposal.description);
      formData.append("category", JSON.stringify(proposal.category));
      formData.append("terms", proposal.terms);
      formData.append("clientName", clientData.leadName || clientData.ename);
      formData.append(
        "clientEmail",
        clientData.emailId || clientData.personal_email
      );

      if (proposal.file) formData.append("attachments", proposal.file);

      await axios.post("http://localhost:5000/api/proposals", formData);

      alert("Proposal saved & sent successfully!");
      setShowPreview(false);
    } catch (err) {
      console.error("Error sending proposal:", err.response?.data || err.message);
      alert("Failed to send proposal");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="text-center mb-4">Create Proposal</h2>

      {!showPreview ? (
        <div className="card p-3 shadow mb-4">
          <input
            type="text"
            name="title"
            placeholder="Proposal Title"
            className="form-control mb-2"
            value={proposal.title}
            onChange={handleProposalChange}
          />

          <CreatableSelect
            isMulti
            options={services}
            value={selectedServices}
            onChange={(selected) => {
              setSelectedServices(selected);
              const mapped =
                selected?.map((s) => ({
                  id: s.value,
                  name: s.label,
                  price: s.price || 0,
                })) || [];
              setProposal({ ...proposal, services: mapped });
            }}
            placeholder="Select services"
          />

          <textarea
            name="description"
            placeholder="Project Description"
            className="form-control mb-2"
            rows={3}
            value={proposal.description}
            onChange={handleProposalChange}
          />

          <CreatableSelect
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={(newValue) => setSelectedCategories(newValue || [])}
            placeholder="Select or type categories/technology"
            className="mb-2"
          />

          <textarea
            name="terms"
            placeholder="Terms & Conditions"
            className="form-control mb-2"
            rows={3}
            value={proposal.terms}
            onChange={handleProposalChange}
          />

          <label>File (Optional)</label>
          <input
            type="file"
            name="attachments"
            onChange={(e) =>
              setProposal({ ...proposal, file: e.target.files[0] })
            }
            className="form-control mb-2"
          />

          <div className="text-center">
            <button
              className="btn btn-primary"
              onClick={() => setShowPreview(true)}
            >
              Preview & Send Proposal
            </button>
          </div>
        </div>
      ) : (
        <div className="card p-4 shadow mb-4">
          <div ref={proposalRef} style={{ textAlign: "left" }}>
            <div className="mb-3">
              <img
                src="/logo.png"
                alt="Company Logo"
                style={{ maxWidth: "120px", marginBottom: "10px" }}
              />
            </div>

            <h2>{proposal.title}</h2>
            <p>
              <strong>Client:</strong> {clientData.leadName || clientData.ename}
            </p>
            <p>
              <strong>Email:</strong>{" "}
              {clientData.emailId || clientData.personal_email}
            </p>
            <p>
              <strong>Phone:</strong> {clientData.phoneNo}
            </p>

            <h5>Services</h5>
            {proposal.services.map((s) => (
              <p key={s.id}>
                {s.name} - ₹{s.price}
              </p>
            ))}

            <p>
              <strong>Description:</strong> {proposal.description}
            </p>
            <p>
              <strong>Categories:</strong> {proposal.category.join(", ")}
            </p>
            <p>
              <strong>Terms:</strong> {proposal.terms}
            </p>
            <p>
              <strong>File:</strong>{" "}
              {proposal.file ? proposal.file.name : "No file attached"}
            </p>
          </div>

          <div className="mt-3 text-center">
            <button
              className="btn btn-primary"
              onClick={handleSaveAndSendProposal}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Proposal"}
            </button>
            <button
              className="btn btn-warning ms-2"
              onClick={() => setShowPreview(false)}
            >
              Back to Edit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proposal;

