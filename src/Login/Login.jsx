import axios from 'axios';
import React, { useState } from 'react';
import { MdEmail, MdLock } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assessts/premier-logo.png';
import { API_URL } from "../config";

function Login() {
  const [formData, setFormData] = useState({
    official_email: '',
    password: ''
  });
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
      const res = await axios.post(`${API_URL}/api/employee/login`, formData);

      // Store token and user info
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


      // Redirect to employee dashboard
      navigate("/employee");
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || "Invalid login credentials");
    } finally {
      setLoading(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user?.employeeId) {
        await axios.post(`${API_URL}/api/employee/logout`, {
          employeeId: user.employeeId
        });
      }

      localStorage.removeItem('token');
      localStorage.removeItem('user');
      navigate("/");
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <div className='container-fluid bg-body-secondary'>
      <div className='row'>
        <div className='col-md-6'>
          <div className='register'>
            <img src={logo} alt="Premier Logo" width="160" className="mb-4 shadow-sm" />
            <h1>Welcome, Premier Webtech</h1>
            <p className="text-center mt-2">Your trusted partner for IT & Digital Marketing solutions.</p>
            <h5>Don't have an account?</h5>
            <Link to="/RegisterationForm" className="btn btn-light" type='submit'>Register</Link>
          </div>
        </div>
        <div className='col-md-6'>
          <div className='d-flex justify-content-center align-items-center vh-100 bg-light login'>
            <div className='card shadow-lg border-0 rounded-4 px-4 py-4' style={{ width: '100%', maxWidth: '420px' }}>
              <div className='text-center mb-4'>
                <img src={logo} alt="Premier Logo" width="120" className="mb-3" />
                <h2 className='fw-bold mb-2'>Login</h2>
              </div>

              {/* Error Message */}
              {error && (
                <div className="alert alert-danger alert-dismissible fade show" role="alert">
                  {error}
                  <button type="button" className="btn-close" onClick={() => setError('')}></button>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="input-group mb-3">
                  <span className="input-group-text bg-light rounded-3 border-end-0">
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
                  />
                </div>
                <div className="input-group mb-2">
                  <span className="input-group-text bg-light rounded-3 border-end-0">
                    <MdLock />
                  </span>
                  <input
                    type="password"
                    className="form-control rounded-3 border-start-0"
                    name='password'
                    placeholder="Enter your Password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className='mb-3 text-end'>
                  <span className="text-muted small">Forget Password?</span>
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

                {/* Admin Login Button */}
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
