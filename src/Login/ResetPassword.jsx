import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate, Link } from "react-router-dom";
import { API_URL } from "../config";
import logo from "../assessts/premier-logo.png";

import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [message, setMessage] = useState("");

 const handleSubmit = async (e) => {
  e.preventDefault();

  if (password !== confirm) {
    setMessage("Passwords do not match!");
    return;
  }

  try {
    const res = await axios.post(`${API_URL}/api/reset-password/${token}`, {
      token,
      newPassword: password
    });

    setMessage(res.data.message);

    setTimeout(() => {
      navigate("/login");
    }, 2000);

  } catch (error) {
    setMessage(error.response?.data?.message || "Error resetting password");
  }
};


  return (
    <div className="container-fluid" style={{ padding: 0 }}>
      <div className="row g-0">

        {/* LEFT PANEL (Same as Login UI) */}
        <div className="col-md-6">
          <div
            style={{
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
            }}
          >
            <div style={{ maxWidth: "520px" }}>
              <img
                src={logo}
                alt="Premier Logo"
                width="160"
                className="mb-4 shadow-sm"
              />
              <h1 style={{ fontSize: "38px", fontWeight: 700 }}>
                Premier Webtech
              </h1>
              <p style={{ marginTop: 15, opacity: 0.95 }}>
                Reset your password securely and continue your work.
              </p>

              <Link
                to="/"
                className="btn btn-outline-light mt-3"
                style={{ padding: "8px 26px", borderRadius: 8 }}
              >
                Back to Login
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL (Card UI same as Login) */}
        <div className="col-md-6 d-flex justify-content-center align-items-center">
          <div
            style={{
              width: "100%",
              maxWidth: "420px",
              borderRadius: "12px",
              boxShadow: "0 12px 30px rgba(24,37,84,0.10)",
              padding: "28px",
              background: "#fff",
              margin: "20px",
            }}
          >
            <div className="text-center mb-3">
              <img src={logo} alt="Premier Logo" width="120" className="mb-2" />
              <h2 className="fw-bold mb-1" style={{ fontSize: "26px" }}>
                Reset Password
              </h2>
            </div>

            {message && (
              <div className="alert alert-info">{message}</div>
            )}

            <form onSubmit={handleSubmit}>

              {/* NEW PASSWORD */}
              <div style={{ position: "relative" }} className="mb-3">
                <input
                  type={showPass ? "text" : "password"}
                  className="form-control"
                  placeholder="New Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ height: "48px", paddingRight: "45px" }}
                />

                <span
                  onClick={() => setShowPass(!showPass)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#555",
                  }}
                >
                  {showPass ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>

              {/* CONFIRM PASSWORD */}
              <div style={{ position: "relative" }} className="mb-3">
                <input
                  type={showConfirm ? "text" : "password"}
                  className="form-control"
                  placeholder="Confirm Password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  style={{ height: "48px", paddingRight: "45px" }}
                />

                <span
                  onClick={() => setShowConfirm(!showConfirm)}
                  style={{
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                    color: "#555",
                  }}
                >
                  {showConfirm ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>

              <button
                className="btn w-100"
                style={{
                  background: "#0d8a4d",
                  color: "white",
                  fontWeight: "600",
                  height: "48px",
                  borderRadius: "8px",
                }}
              >
                Reset Password
              </button>
            </form>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
