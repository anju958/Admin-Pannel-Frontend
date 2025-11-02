import React, { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { Link } from "react-router-dom";
import logo from "../../../src/assessts/premier-logo.png";

function ClientLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMessage("");

    const response = await fetch("/client/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      setMessage("Login successful! Redirecting...");
      window.location.href = "/client/dashboard";
    } else {
      setMessage(data.error || "Invalid email or password.");
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
            <div className="text-center mb-3 fw-bold fs-2" style={{ letterSpacing: "0.5px" }}>
              Client Login
            </div>
            <form style={{ width: '100%' }} onSubmit={handleLogin}>
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
              <div className="input-group mb-3">
                <span className="input-group-text bg-light">
                  <MdLock />
                </span>
                <input
                  type="password"
                  className="form-control"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button
                type="submit"
                className="btn bg-dark-subtle w-100 rounded-pill fw-bold mb-2"
                style={{
                  background: "#e0e8f3",
                  color: "#222",
                  height: "42px",
                  marginBottom: "8px"
                }}
              >
                Login
              </button>
            </form>
            {message && (
              <div className="alert alert-warning w-100 mt-2 text-center p-2">
                {message}
              </div>
            )}
            {/* First-Time Create Password Link */}
            <div className="mt-3 text-center border-top pt-3 w-100">
              <span className="fw-semibold text-secondary fs-6">
                First time here?
              </span>
              <br />
              <Link
                to="/CreatePassword"
                className="fw-bold text-primary fs-5 text-decoration-underline"
                style={{ letterSpacing: "0.5px" }}
              >
                Create your password
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ClientLogin;
