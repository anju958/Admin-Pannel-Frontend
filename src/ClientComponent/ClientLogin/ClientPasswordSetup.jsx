import React, { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import logo from "../../assessts/premier-logo.png"; // Update path if needed

function ClientPasswordSetup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(""); // Optional: received via backend email link

  // Step 1: Email verification/request
  async function handleEmailSubmit(e) {
    e.preventDefault();
    setMessage("");
    // Call backend to send password setup token.
    const response = await fetch("/client/request-password-setup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Setup link sent! Check your email, or enter setup token below.");
      setStep(2);
    } else {
      setMessage(data.error || "Email not found.");
    }
  }

  // Step 2: Password creation
  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    // Call backend to complete password setup.
    const response = await fetch("/client/setup-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    const data = await response.json();
    if (response.ok) {
      setMessage("Password set successfully. You can now login.");
    } else {
      setMessage(data.error || "Failed to set password.");
    }
  }

  return (
    <div className="container-fluid bg-body-secondary" style={{ minHeight: "100vh" }}>
      <div className="row justify-content-center align-items-center" style={{ minHeight: "100vh" }}>
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div
            className="card shadow-lg p-4"
            style={{
              width: "400px",
              borderRadius: "20px",
              background: "#fff",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            <img
              src={logo}
              alt="Premier Logo"
              width="100"
              style={{ marginBottom: "12px" }}
            />
            <div className="text-center mb-3 fw-bold fs-2">Create Password</div>
            {step === 1 ? (
              <form style={{ width: '100%' }} onSubmit={handleEmailSubmit}>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light">
                    <MdEmail />
                  </span>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your Email ID"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-dark-subtle w-100 rounded-pill fw-bold mb-2"
                  style={{
                    background: "#e0e8f3",
                    color: "#222",
                    height: "42px"
                  }}
                >
                  Request Password Setup
                </button>
              </form>
            ) : (
              <form style={{ width: '100%' }} onSubmit={handlePasswordSubmit}>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light">
                    <MdLock />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Enter New Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light">
                    <MdLock />
                  </span>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Confirm New Password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light">
                    Token
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter setup token (if provided)"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn bg-dark-subtle w-100 rounded-pill fw-bold mb-2"
                  style={{
                    background: "#e0e8f3",
                    color: "#222",
                    height: "42px"
                  }}
                >
                  Set Password
                </button>
              </form>
            )}
            {message && (
              <div className="alert alert-warning w-100 mt-2 text-center p-2">
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientPasswordSetup;
