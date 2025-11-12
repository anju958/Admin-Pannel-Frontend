import React, { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import logo from "../../assessts/premier-logo.png";
import axios from "axios";
import { API_URL } from "../../config";
import { useNavigate } from "react-router-dom"; 

function ClientPasswordSetup() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); 

  async function handleEmailSubmit(e) {
    e.preventDefault();
    setMessage("");
    try {
      const response = await axios.post(`${API_URL}/api/client/send-password-otp`, {
        emailId: email,
      });
      setMessage(response.data.message || "OTP sent to your email.");
      setStep(2);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to send OTP. Please try again."
      );
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setMessage("");
    if (password !== confirmPassword) {
      setMessage("Passwords do not match.");
      return;
    }
    try {
      const response = await axios.post(`${API_URL}/api/client/create-password`, {
        emailId: email,
        otp,
        password,
      });
      setMessage(response.data.message || "Password set successfully.");
      setTimeout(() => {
        navigate('/client/ClientPage'); // Correct redirect
      }, 1500);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to set password. Please try again."
      );
    }
  }

  async function handleResendOtp() {
    setMessage("");
    try {
      const response = await axios.post(`${API_URL}/api/client/send-password-otp`, {
        emailId: email,
      });
      setMessage(response.data.message || "OTP resent to your email.");
    } catch (error) {
      setMessage(error.response?.data?.message || "Failed to resend OTP.");
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
                  Request OTP
                </button>
              </form>
            ) : (
              <form style={{ width: '100%' }} onSubmit={handlePasswordSubmit}>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light">OTP</span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter OTP from email"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
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
                <div className="d-flex mb-2" style={{ gap: "12px" }}>
                  <button
                    type="button"
                    className="btn fw-bold"
                    onClick={handleResendOtp}
                    style={{
                      color: "#1565c0",
                      fontSize: "0.95rem",
                      textDecoration: "underline",
                      background: "none"
                    }}
                  >
                    Resend OTP
                  </button>
                  <button
                    type="submit"
                    className="btn bg-dark-subtle w-100 rounded-pill fw-bold"
                    style={{
                      background: "#e0e8f3",
                      color: "#222",
                      height: "42px"
                    }}
                  >
                    Set Password
                  </button>
                </div>
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
