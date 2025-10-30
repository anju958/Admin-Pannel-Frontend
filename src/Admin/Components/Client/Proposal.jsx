
import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import CreatableSelect from "react-select/creatable";
import { API_URL } from "../../../config";

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
  const [totalPrice, setTotalPrice] = useState(0);

  const [proposal, setProposal] = useState({
    title: "",
    services: [],
    description: "",
    category: [],
    terms: "",
    file: null,
  });

  // ✅ Ensure client data exists
  useEffect(() => {
    if (!clientData?._id) {
      alert("Client data missing! Go back and select a client.");
      navigate(-1);
    }
  }, [clientData, navigate]);

  // ✅ Fetch all available services
  useEffect(() => {
    axios
      .get(`${API_URL}/api/getServices`)
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

  // ✅ Auto pre-fill lead's existing service
  useEffect(() => {
    if (clientData?.service) {
      const leadService = {
        id: clientData.service._id,
        name: clientData.service.serviceName,
        price: clientData.project_price || clientData.service.servicePrice || 0,
      };
      setProposal((prev) => ({
        ...prev,
        services: [leadService],
      }));

      setSelectedServices([
        {
          value: clientData.service._id,
          label: clientData.service.serviceName,
          price:
            clientData.project_price || clientData.service.servicePrice || 0,
        },
      ]);
    }
  }, [clientData]);

  // ✅ Update category list in proposal
  useEffect(() => {
    setProposal((prev) => ({
      ...prev,
      category: selectedCategories.map((c) => c.label),
    }));
  }, [selectedCategories]);

  // ✅ Auto total price calculation
  useEffect(() => {
    const total = proposal.services.reduce(
      (sum, s) => sum + Number(s.price || 0),
      0
    );
    setTotalPrice(total);
  }, [proposal.services]);

  const handleProposalChange = (e) => {
    setProposal({ ...proposal, [e.target.name]: e.target.value });
  };

  // ✅ Save & Send proposal
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
      formData.append("totalPrice", totalPrice);
      formData.append("clientName", clientData.leadName || clientData.ename);
      formData.append(
        "clientEmail",
        clientData.emailId || clientData.personal_email
      );

      if (proposal.file) formData.append("attachments", proposal.file);

      await axios.post(`${API_URL}/api/proposals`, formData);
      alert("Proposal saved & sent successfully!");
      setShowPreview(false);
    } catch (err) {
      console.error("Error sending proposal:", err.response?.data || err);
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
          {/* Proposal Title */}
          <input
            type="text"
            name="title"
            placeholder="Proposal Title"
            className="form-control mb-3"
            value={proposal.title}
            onChange={handleProposalChange}
          />

          {/* Services Select */}
          <CreatableSelect
            isMulti
            options={services}
            value={selectedServices}
            onChange={(selected) => {
              const mapped =
                selected?.map((s) => {
                  const existing = proposal.services.find(
                    (ps) => ps.id === s.value
                  );
                  return {
                    id: s.value,
                    name: s.label,
                    price: existing ? existing.price : s.price || 0,
                  };
                }) || [];
              setSelectedServices(selected);
              setProposal({ ...proposal, services: mapped });
            }}
            placeholder="Select or add services"
          />

          {/* Editable Service Prices */}
          {proposal.services.length > 0 && (
            <div className="mt-3">
              <h6>Edit Service Prices:</h6>
              {proposal.services.map((service, index) => (
                <div
                  key={service.id}
                  className="d-flex align-items-center mb-2"
                  style={{ gap: "10px" }}
                >
                  <strong style={{ width: "150px" }}>{service.name}</strong>
                  <input
                    type="number"
                    min="0"
                    className="form-control"
                    style={{ maxWidth: "200px" }}
                    value={service.price}
                    onChange={(e) => {
                      const updated = [...proposal.services];
                      updated[index].price = e.target.value;
                      setProposal({ ...proposal, services: updated });
                    }}
                  />
                </div>
              ))}

              <div className="text-end mt-2">
                <strong>Total Price: ₹{totalPrice}</strong>
              </div>
            </div>
          )}

          {/* Description */}
          <textarea
            name="description"
            placeholder="Project Description"
            className="form-control mb-3"
            rows={3}
            value={proposal.description}
            onChange={handleProposalChange}
          />

          {/* Category */}
          <CreatableSelect
            isMulti
            options={categories}
            value={selectedCategories}
            onChange={(newValue) => setSelectedCategories(newValue || [])}
            placeholder="Select or type categories"
            className="mb-3"
          />

          {/* Terms */}
          <textarea
            name="terms"
            placeholder="Terms & Conditions"
            className="form-control mb-3"
            rows={3}
            value={proposal.terms}
            onChange={handleProposalChange}
          />

          {/* File Upload */}
          <label>File (Optional)</label>
          <input
            type="file"
            name="attachments"
            onChange={(e) =>
              setProposal({ ...proposal, file: e.target.files[0] })
            }
            className="form-control mb-3"
          />

          {/* Buttons */}
          <div className="text-center mt-3">
            <button
              className="btn btn-primary px-4 me-3"
              onClick={() => setShowPreview(true)}
            >
              Preview & Send Proposal
            </button>

            {/* ✅ Back Button */}
            <button
              type="button"
              className="btn btn-secondary px-4"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      ) : (
        // ✅ Proposal Preview
        <div className="card p-4 shadow mb-4">
          <div ref={proposalRef}>
            <h2>{proposal.title}</h2>
            <p>
              <strong>Client:</strong> {clientData.leadName}
            </p>
            <p>
              <strong>Email:</strong> {clientData.emailId}
            </p>
            <p>
              <strong>Phone:</strong> {clientData.phoneNo}
            </p>

            <h5>Services:</h5>
            {proposal.services.map((s) => (
              <p key={s.id}>
                {s.name} - ₹{s.price}
              </p>
            ))}

            <p>
              <strong>Total Price:</strong> ₹{totalPrice}
            </p>

            <p>
              <strong>Description:</strong> {proposal.description}
            </p>
            <p>
              <strong>Categories:</strong> {proposal.category.join(", ")}
            </p>
            <p>
              <strong>Terms:</strong> {proposal.terms}
            </p>
          </div>

          <div className="text-center mt-3">
            <button
              className="btn btn-success px-4"
              onClick={handleSaveAndSendProposal}
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Proposal"}
            </button>

            <button
              className="btn btn-secondary px-4 ms-3"
              onClick={() => setShowPreview(false)}
            >
              Back to Edit
            </button>

            {/* ✅ Back Button in Preview too */}
            <button
              type="button"
              className="btn btn-outline-dark px-4 ms-3"
              onClick={() => navigate(-1)}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Proposal;
