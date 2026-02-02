import axios from "axios";
import React, { useState } from "react";
import { MdEmail, MdLock } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assessts/premier-logo.png";
import { API_URL } from "../config";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const [formData, setFormData] = useState({
    official_email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 
const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError("");

  try {
    const res = await axios.post(`${API_URL}/api/userLogin`, formData);

    const {
      token,
      employeeId,
      ename,
      official_email,
      attendanceStatus,
      check_in,
    } = res.data;

    if (!token || !employeeId) {
      throw new Error("Invalid login response");
    }

    localStorage.setItem("token", token);
    localStorage.setItem(
      "user",
      JSON.stringify({ employeeId, ename, official_email })
    );

    if (check_in) localStorage.setItem("loginTime", check_in);

    navigate("/employee");
  } catch (err) {
    setError(err.response?.data?.message || "Login failed");
  } finally {
    setLoading(false);
  }
};

  const leftPanelStyle = {
    minHeight: '100vh',
    background: '#5fa0ff',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 30px',
    borderTopRightRadius: '120px',
    borderBottomRightRadius: '120px',
    boxSizing: 'border-box',
    textAlign: 'center'
  };

  const leftInnerStyle = {
    maxWidth: '520px',
    margin: '0 auto'
  };

  const rightWrapperStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px 20px',
    background: '#f8f9fa' // light background to match screenshot
  };

  const cardStyle = {
    width: '100%',
    maxWidth: '420px',
    borderRadius: '12px',
    boxShadow: '0 12px 30px rgba(24,37,84,0.10)',
    padding: '28px',
    background: '#fff'
  };

  const logoSmallStyle = {
    width: '120px',
    display: 'block',
    margin: '0 auto 8px'
  };

  const inputIconStyle = {
    minWidth: '44px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: '#f1f6ff'
  };
  return (
    <div className="container-fluid" style={{ padding: 0 }}>
      <div className="row g-0">
         <style>{`
        @media (max-width: 767.98px) {
          .left-panel-rounded {
            border-top-right-radius: 40px !important;
            border-bottom-right-radius: 40px !important;
            padding: 24px !important;
          }
          .login-card {
            margin-top: 20px;
            box-shadow: none !important;
            border-radius: 8px !important;
          }
        }
      `}</style>
        {/* LEFT PANEL */}
        <div className="col-md-6 d-flex align-items-center justify-content-center"
          style={{
            minHeight: "100vh",
            background: "#5fa0ff",
            color: "#fff",
            borderTopRightRadius: 120,
            borderBottomRightRadius: 120,
          }}
        >
          <div className="text-center px-4">
            <img src={logo} alt="Premier Logo" width="160" className="mb-4" />
            <h1 className="fw-bold">Welcome, Premier Webtech</h1>
            <p>Your trusted partner for IT & Digital Marketing solutions.</p>
            <Link to="/RegisterationForm" className="btn btn-outline-light mt-3">
              Register
            </Link>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="col-md-6 d-flex align-items-center justify-content-center"
          style={{ minHeight: "100vh", background: "#f8f9fa" }}
        >
          <div className="bg-white p-4 rounded shadow" style={{ width: 420 }}>
            <div className="text-center mb-3">
              <img src={logo} alt="Premier Logo" width="120" />
              <h2 className="fw-bold mt-2">Login</h2>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="input-group mb-3">
                <span className="input-group-text">
                  <MdEmail />
                </span>
                <input
                  type="email"
                  name="official_email"
                  className="form-control"
                  placeholder="Email"
                  value={formData.official_email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group mb-3 position-relative">
                <span className="input-group-text">
                  <MdLock />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <span
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: "50%",
                    transform: "translateY(-50%)",
                    cursor: "pointer",
                  }}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </span>
              </div>
              <div className=" text-center mb-2 mt-3">
              <Link to="/forgot-password">Forgot Password?</Link>
            </div>

              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            
            
                <div className="text-center mb-4 mt-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary px-4"
                    onClick={() => navigate('/adminLogin')}
                  >
                    Admin Login
                  </button>
                </div>
                   {/* <div className="pt-3 pb-2 mt-2 text-center" style={{ borderTop: "1px solid #eee" }}>
                <span className='fw-semibold text-secondary'>Are you a Client?</span>
                <br />
                <Link
                  to="/client/ClientPage"
                  className='fw-bold text-primary fs-5 text-decoration-underline'
                  style={{ letterSpacing: "0.5px" }}
                >
                  Create your password and login here
                </Link>
              </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
