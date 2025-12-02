import axios from "axios";
import React, { useState, useContext } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import logo from "../assessts/premier-logo.png";
import { API_URL } from "../config";
import { AuthContext } from "../Context/AuthContext";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function AdminLogin() {
  const [formData, setFormData] = useState({
    official_email: "",
    password: "",
    role: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_URL}/api/adminLogin`, formData);
      const user = res.data.user;

      if (!user || !user._id) {
        alert("Login succeeded but no valid user ID returned");
        return;
      }

      localStorage.setItem("chatUserId", user._id);
      localStorage.setItem("chatRole", user.role);
      localStorage.setItem("chatName", user.name);

      login({ token: res.data.token, user: user });
      navigate("/admin/home");
    } catch (err) {
      alert("Invalid credentials or user does not exist for selected role");
    }
  };

  return (
    <div
      className="container-fluid p-0"
      style={{ minHeight: "100vh", background: "#f5f6fc" }}
    >
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ minHeight: "100vh" }}
      >
        <div
          className="shadow-lg border-0 rounded-4 px-4 pt-5 pb-4"
          style={{
            minWidth: "400px",
            maxWidth: "420px",
            background: "white",
            borderRadius: "20px",
          }}
        >
          <div className="text-center mb-4">
            <img src={logo} alt="Premier Logo" width="120" className="mb-3" />
            <h2 className="fw-bold mb-2">Admin & HR Panel Login</h2>
          </div>

          <form onSubmit={handleSubmit}>
            {/* EMAIL FIELD */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#eef3ff",
                padding: "0 15px",
                height: "50px",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            >
              <MdEmail size={20} style={{ marginRight: "10px", color: "#444" }} />
              <input
                type="text"
                name="official_email"
                placeholder="Email"
                value={formData.official_email}
                onChange={handleChange}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "15px",
                }}
              />
            </div>

            {/* PASSWORD FIELD */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                background: "#eef3ff",
                padding: "0 15px",
                height: "50px",
                borderRadius: "12px",
                marginBottom: "15px",
              }}
            >
              <MdLock size={20} style={{ marginRight: "10px", color: "#444" }} />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                style={{
                  border: "none",
                  outline: "none",
                  background: "transparent",
                  width: "100%",
                  fontSize: "15px",
                }}
              />

              <span
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  cursor: "pointer",
                  fontSize: "18px",
                  marginLeft: "10px",
                }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
                

              </span>
            </div>

            {/* ROLE SELECT */}
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: "100%",
                height: "50px",
                background: "#eef3ff",
                borderRadius: "12px",
                border: "none",
                paddingLeft: "15px",
                fontSize: "15px",
                outline: "none",
                marginBottom: "20px",
              }}
            >
              <option value="">Select Role</option>
              <option value="superadmin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="hr">HR</option>
              <option value="account">Accountant</option>
              <option value="manager">Manager</option>
            </select>

            {/* LOGIN BUTTON */}
            <button
              type="submit"
              style={{
                width: "100%",
                height: "50px",
                background: "#0d6efd",
                borderRadius: "12px",
                color: "white",
                fontWeight: "bold",
                fontSize: "18px",
                border: "none",
              }}
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
