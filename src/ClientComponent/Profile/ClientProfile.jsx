import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../config";

const ClientProfile = () => {
  const stored = JSON.parse(localStorage.getItem("clientUser") || "null");
  const clientId = stored?._id;

  const [profile, setProfile] = useState({
    leadName: "",
    emailId: "",
    phoneNo: ""
  });

  const [errors, setErrors] = useState({ phoneNo: "" });
  const [saving, setSaving] = useState(false);

  // Fetch profile
  useEffect(() => {
    if (!clientId) return;

    axios
      .get(`${API_URL}/api/client/profile/${clientId}`)
      .then((res) => {
        const client = res.data.client;
        setProfile({
          leadName: client.leadName || "",
          emailId: client.emailId || "",
          phoneNo: client.phoneNo || ""
        });
      })
      .catch((err) => console.error(err));
  }, [clientId]);

  // Phone validation
  const validatePhone = (value) => {
    if (!/^[0-9]*$/.test(value)) return "Phone number must contain digits only";
    if (value.length !== 10) return "Phone number must be exactly 10 digits";
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "phoneNo") {
      const error = validatePhone(value);
      setErrors({ ...errors, phoneNo: error });
    }

    setProfile({ ...profile, [name]: value });
  };

  const handleSave = async () => {
    if (errors.phoneNo) {
      alert("Please fix the validation errors before saving.");
      return;
    }

    setSaving(true);

    try {
      const res = await axios.put(
        `${API_URL}/api/client/profile/${clientId}`,
        profile
      );

      const updated = res.data.client;
      localStorage.setItem("clientUser", JSON.stringify(updated));

      setSaving(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setSaving(false);
      alert("Failed to update profile.");
    }
  };

  return (
    <div className="container mt-4">

      {/* Gradient Page Header */}
      <div
        className="p-3 mb-4"
        style={{
          background: "linear-gradient(90deg, #1A2A6C, #6A11CB 60%, #2575FC 100%)",
          color: "white",
          borderRadius: "14px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.15)",
        }}
      >
        <h2 className="fw-bold m-0">Client Profile</h2>
      </div>

      {/* Card Container */}
      <div
        className="shadow-lg p-4"
        style={{
          background: "white",
          borderRadius: "16px",
          boxShadow: "0px 6px 20px rgba(0,0,0,0.12)",
        }}
      >
        {/* Name */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Full Name</label>
          <input
            className="form-control p-3"
            name="leadName"
            value={profile.leadName}
            onChange={handleChange}
            style={{ borderRadius: "10px", fontSize: "1rem" }}
          />
        </div>

        {/* Email */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Email Address</label>
          <input
            className="form-control p-3"
            name="emailId"
            value={profile.emailId}
            onChange={handleChange}
            style={{ borderRadius: "10px", fontSize: "1rem" }}
            disabled
          />
          <small className="text-muted">Email cannot be changed.</small>
        </div>

        {/* Phone */}
        <div className="mb-3">
          <label className="form-label fw-semibold">Phone Number</label>
          <input
            className={`form-control p-3 ${errors.phoneNo ? "is-invalid" : ""}`}
            name="phoneNo"
            value={profile.phoneNo}
            maxLength="10"
            onChange={handleChange}
            style={{ borderRadius: "10px", fontSize: "1rem" }}
          />
          {errors.phoneNo && (
            <div className="invalid-feedback">{errors.phoneNo}</div>
          )}
        </div>

        {/* Save Button */}
        <button
          className="btn btn-primary mt-2 px-4 py-2"
          onClick={handleSave}
          disabled={saving || errors.phoneNo}
          style={{
            borderRadius: "10px",
            fontWeight: "600",
            fontSize: "1rem",
          }}
        >
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </div>
  );
};

export default ClientProfile;
