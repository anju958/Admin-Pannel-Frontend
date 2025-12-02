import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL } from "../config";
import logo from "../assessts/premier-logo.png";

function ForgetPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API_URL}/api/forget-password`, {
        official_email: email,
      });

      setMessage(res.data.message);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error sending email");
    }
  };

  // Left Welcome Panel Style
  const leftPanelStyle = {
    minHeight: "100vh",
    background: "#5fa0ff",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 30px",
    borderTopRightRadius: "120px",
    borderBottomRightRadius: "120px",
    textAlign: "center",
  };

  const leftInnerStyle = {
    maxWidth: "520px",
    margin: "0 auto",
  };

  // Right Panel Wrapper
  const rightWrapperStyle = {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
    background: "#f8f9fa",
  };

  // Card Style
  const cardStyle = {
    width: "100%",
    maxWidth: "420px",
    borderRadius: "12px",
    boxShadow: "0 12px 30px rgba(24,37,84,0.10)",
    padding: "28px",
    background: "#fff",
  };

  return (
    <div className="container-fluid" style={{ padding: 0 }}>
      <style>
        {`
          @media (max-width: 767.98px) {
            .left-panel-rounded {
              border-top-right-radius: 40px !important;
              border-bottom-right-radius: 40px !important;
              padding: 24px !important;
            }
          }
        `}
      </style>

      <div className="row g-0">
        {/* Left Welcome Section */}
        <div className="col-md-6">
          <div style={leftPanelStyle} className="left-panel-rounded">
            <div style={leftInnerStyle}>
              <img src={logo} alt="Premier Logo" width="160" className="mb-4 shadow-sm" />
              <h1 style={{ fontSize: "38px", fontWeight: 700 }}>Forgot Password?</h1>
              <p style={{ marginTop: 8, opacity: 0.95, fontSize: "16px" }}>
                Enter your email to receive a reset link.
              </p>
            </div>
          </div>
        </div>

        {/* Right Forget Password Card */}
        <div className="col-md-6">
          <div style={rightWrapperStyle}>
            <div style={cardStyle}>
              <div className="text-center mb-3">
                <img src={logo} alt="Premier Logo" width="120" className="mb-3" />
                <h2 className="fw-bold mb-1">Forgot Password</h2>
              </div>

              {message && (
                <div className="alert alert-info">{message}</div>
              )}

              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  className="form-control mb-3"
                  placeholder="Enter your official email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    height: "48px",
                    borderRadius: "8px",
                    paddingLeft: "14px",
                  }}
                />

                <button
                  className="btn btn-primary w-100 mt-2"
                  style={{
                    height: "48px",
                    fontWeight: "600",
                    borderRadius: "8px",
                  }}
                >
                  Send Reset Link
                </button>
              </form>

              <div className="text-center mt-3">
                <Link to="/" className="text-primary" style={{ fontSize: "15px" }}>
                  Back to Login
                </Link>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default ForgetPassword;
