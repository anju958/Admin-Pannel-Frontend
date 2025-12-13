import axios from 'axios';
import React, { useState } from 'react';
import { MdEmail, MdLock } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assessts/premier-logo.png';
import { API_URL } from "../config";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

function Login() {
  const [formData, setFormData] = useState({
    official_email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setError('');

  try {
    const res = await axios.post(`${API_URL}/api/userLogin`, formData);

    // Extract attendance info
    const { attendanceStatus, check_in } = res.data;

    // Show messages based on status
    if (attendanceStatus === "not_marked_out_of_office_time") {
      alert("Logged in, but attendance not marked (outside office time).");
    }

    if (attendanceStatus === "already_marked") {
      console.log("Attendance already marked today.");
    }

    if (attendanceStatus === "attendance_error") {
      alert("Attendance marking failed, but login successful.");
    }

    // Store user info
    localStorage.setItem('token', res.data.token);
    const user = {
      _id: res.data.employeeId,
      employeeId: res.data.employeeId,
      ename: res.data.ename,
      official_email: res.data.official_email,
    };

    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("chatUserId", res.data.employeeId);
    localStorage.setItem("chatRole", "employee");
    localStorage.setItem("chatName", res.data.ename);

    // store check-in time
    localStorage.setItem("loginTime", check_in);

    navigate("/employee");

  } catch (err) {
    console.error("Login error:", err);
    setError(err.response?.data?.message || "Invalid login credentials");
  } finally {
    setLoading(false);
  }
};



  // Inline style objects
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
    <div className='container-fluid' style={{ padding: 0 }}>
      {/* small style block for responsive behaviour (keeps inside component) */}
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

      <div className='row g-0'>
        {/* Left welcome panel */}
        <div className='col-md-6'>
          <div style={leftPanelStyle} className="left-panel-rounded">
            <div style={leftInnerStyle}>
              <img src={logo} alt="Premier Logo" width="160" className="mb-4 shadow-sm" />
              <h1 style={{ fontSize: '38px', fontWeight: 700, marginBottom: '8px' }}>Welcome, Premier Webtech</h1>
              <p style={{ marginTop: 8, opacity: 0.95, fontSize: '16px' }}>
                Your trusted partner for IT & Digital Marketing solutions.
              </p>
              <h5 style={{ marginTop: 22, fontWeight: 600 }}>Don't have an account?</h5>
              <Link to="/RegisterationForm" className="btn btn-outline-light mt-2" style={{ padding: '8px 26px', borderRadius: 8 }}>
                Register
              </Link>
            </div>
          </div>
        </div>

        {/* Right login panel */}
        <div className='col-md-6'>
          <div style={rightWrapperStyle}>
            <div style={cardStyle} className="login-card">
              <div className='text-center mb-3'>
                <img src={logo} alt="Premier Logo" style={logoSmallStyle} />
                <h2 className='fw-bold mb-1' style={{ fontSize: '26px' }}>Login</h2>
              </div>

              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3" style={{ alignItems: 'stretch' }}>
                  <span className="input-group-text rounded-3 border-end-0" style={inputIconStyle}>
                    <MdEmail />
                  </span>
                  <input
                    type="email"
                    className="form-control rounded-3 border-start-0"
                    name='official_email'
                    placeholder="Enter your Email"
                    value={formData.official_email}
                    onChange={handleChange}
                    required
                    style={{ height: 48 }}
                  />
                </div>

                <div className="input-group mb-2" style={{ alignItems: 'stretch' }}>
                  <span className="input-group-text rounded-3 border-end-0" style={{ minWidth: "44px", display: "flex", justifyContent: "center", background: "#f1f6ff" }}>
                    <MdLock />
                  </span>

                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control rounded-3 border-start-0"
                    name="password"
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    style={{ height: 48 }}
                  />

                  <span

                    style={{
                      cursor: "pointer", position: "absolute",
                      right: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      cursor: "pointer",
                      color: "#555",
                      background: "transparent"
                    }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </span>
                </div>


                <div className='mb-3 text-end'>
                  <span className="text-muted small">
                    <Link to="forgot-password">
                    Forget Password</Link></span>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100 rounded-3 fw-bold py-2 mb-2"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Logging in...
                    </>
                  ) : (
                    'Login'
                  )}
                </button>

                <div className="text-center mb-3">
                  <button
                    type="button"
                    className="btn btn-outline-primary px-4"
                    onClick={() => navigate('/adminLogin')}
                  >
                    Admin Login
                  </button>
                </div>
              </form>

              <div className="pt-3 pb-2 mt-2 text-center" style={{ borderTop: "1px solid #eee" }}>
                <span className='fw-semibold text-secondary'>Are you a Client?</span>
                <br />
                <Link
                  to="/client/ClientPage"
                  className='fw-bold text-primary fs-5 text-decoration-underline'
                  style={{ letterSpacing: "0.5px" }}
                >
                  Create your password and login here
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
