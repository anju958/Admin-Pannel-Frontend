
import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from "axios";
import { API_URL } from "../../../config";

const CompanyDetailsPage = () => {
  const [company, setCompany] = useState({
    name: "",
    address: { street: "", city: "", state: "", zip: "", country: "" },
    phone: "",
    email: "",
    website: "",
    taxId: "",
    bank: { bankName: "", accountNumber: "", ifsc: "" },
    logoUrl: ""
  });
  const [editing, setEditing] = useState(false);

  // GET company details (on mount)
  useEffect(() => {
    axios.get(`${API_URL}/api/getCompnayDetails`)
      .then(res => res.data?.[0] && setCompany(res.data[0]))
      .catch(error => console.error("Error fetching company:", error));
  }, []);

  // Handle input changes
  const handleChange = e => {
    const { name, value } = e.target;
    if (name.startsWith("address.")) {
      setCompany({ ...company, address: { ...company.address, [name.split(".")[1]]: value } });
    } else if (name.startsWith("bank.")) {
      setCompany({ ...company, bank: { ...company.bank, [name.split(".")[1]]: value } });
    } else {
      setCompany({ ...company, [name]: value });
    }
  };

  // Save logic (POST/PUT)
  const handleSave = async () => {
    try {
      let response;
      if (company._id) {
        response = await axios.put(`${API_URL}/api/updateCompnay/${company._id}`, company, {
          headers: { "Content-Type": "application/json" }
        });
      } else {
        response = await axios.post(`${API_URL}/api/companyDetails`, company, {
          headers: { "Content-Type": "application/json" }
        });
      }
      setCompany(response.data);
      setEditing(false);
    } catch (error) {
      console.error("Error saving company details:", error);
      alert("Error saving company details.");
    }
  };

  // Remove logo handler (call on button click)
  const handleRemoveLogo = () => {
    setCompany({ ...company, logoUrl: "" });
  };

  return (
    <div className="container mt-4">
      <div className="card shadow">
        <div className="card-header bg-primary text-white">
          <h4 className="mb-0">🏢 Company Details</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="fw-semibold">Name:</label>
              <input name="name" value={company.name} onChange={handleChange} disabled={!editing} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold">Phone:</label>
              <input name="phone" value={company.phone} onChange={handleChange} disabled={!editing} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold">Email:</label>
              <input name="email" value={company.email} onChange={handleChange} disabled={!editing} className="form-control" />
            </div>
            <div className="col-md-6">
              <label className="fw-semibold">Website:</label>
              <input name="website" value={company.website} onChange={handleChange} disabled={!editing} className="form-control" />
            </div>
          </div>
          <hr />
          <h5 className="text-secondary mb-3">🗺 Address</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input name="address.street" value={company.address.street} onChange={handleChange} disabled={!editing} className="form-control" placeholder="Street" />
            </div>
            <div className="col-md-3">
              <input name="address.city" value={company.address.city} onChange={handleChange} disabled={!editing} className="form-control" placeholder="City" />
            </div>
            <div className="col-md-2">
              <input name="address.state" value={company.address.state} onChange={handleChange} disabled={!editing} className="form-control" placeholder="State" />
            </div>
            <div className="col-md-3">
              <input name="address.zip" value={company.address.zip} onChange={handleChange} disabled={!editing} className="form-control" placeholder="ZIP" />
            </div>
            <div className="col-md-4 mt-2">
              <input name="address.country" value={company.address.country} onChange={handleChange} disabled={!editing} className="form-control" placeholder="Country" />
            </div>
          </div>
          <hr />
          <h5 className="text-secondary mb-3">💼 Bank Details</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input name="bank.bankName" value={company.bank.bankName} onChange={handleChange} disabled={!editing} className="form-control" placeholder="Bank Name" />
            </div>
            <div className="col-md-4">
              <input name="bank.accountNumber" value={company.bank.accountNumber} onChange={handleChange} disabled={!editing} className="form-control" placeholder="Account No." />
            </div>
            <div className="col-md-4">
              <input name="bank.ifsc" value={company.bank.ifsc} onChange={handleChange} disabled={!editing} className="form-control" placeholder="IFSC Code" />
            </div>
          </div>
          <div className="row mt-3">
            <div className="col-md-6">
              <label className="fw-semibold">Tax ID (GST/VAT):</label>
              <input name="taxId" value={company.taxId} onChange={handleChange} disabled={!editing} className="form-control" />
            </div>
            {/* <div className="col-md-6 text-center">
              <label className="fw-semibold">Logo Preview:</label>
              {company.logoUrl && (
                <div>
                  <img src={company.logoUrl} alt="Logo" style={{maxHeight:80}} className="d-block mx-auto mb-2 border border-info rounded" />
                  {editing && (
                    <button className="btn btn-outline-danger btn-sm mt-2" type="button" onClick={handleRemoveLogo}>
                      Remove Logo
                    </button>
                  )}
                </div>
              )}
              <input name="logoUrl" value={company.logoUrl} onChange={handleChange} disabled={!editing} className="form-control" />
            </div> */}
          </div>
          <div className="text-end mt-4">
            {editing ? (
              <button className="btn btn-success px-4" onClick={handleSave}>Save</button>
            ) : (
              <button className="btn btn-primary px-4" onClick={() => setEditing(true)}>Edit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetailsPage;
