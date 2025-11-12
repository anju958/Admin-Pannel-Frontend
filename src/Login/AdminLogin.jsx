
import axios from 'axios';
import React, { useState, useContext } from 'react';
import { MdEmail, MdLock } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import logo from '../assessts/premier-logo.png';
import { API_URL } from "../config";
import { AuthContext } from '../Context/AuthContext';

function AdminLogin() {
  const [formData, setFormData] = useState({
    official_email: '',
    password: '',
    role: ''
  });
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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

    // Save real user id for chat
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
    <div className='container-fluid p-0' style={{ minHeight: "100vh", background: "#f5f6fc" }}>
      <div className='d-flex justify-content-center align-items-center' style={{ minHeight: "100vh" }}>
        <div className='card shadow-lg border-0 rounded-4 px-4 pt-5 pb-4' style={{ minWidth: "400px", maxWidth: "420px" }}>
          <div className='text-center mb-4'>
            <img src={logo} alt="Premier Logo" width="120" className="mb-3" />
            <h2 className='fw-bold mb-2'>Admin & HR Panel Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="input-group mb-3">
              <span className="input-group-text bg-light rounded-3 border-end-0"><MdEmail /></span>
              <input type="text" className="form-control rounded-3 border-start-0" name='official_email' placeholder="Email" value={formData.official_email} onChange={handleChange} required />
            </div>
            <div className="input-group mb-2">
              <span className="input-group-text bg-light rounded-3 border-end-0"><MdLock /></span>
              <input type="password" className="form-control rounded-3 border-start-0" name='password' placeholder="Password" value={formData.password} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <select name="role" className="form-select rounded-3" value={formData.role} onChange={handleChange} required>
                <option value="">Select Role</option>
                <option value="superadmin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="account">Accountant</option>
                <option value="manager">Manager</option>
              </select>
            </div>
            <button type="submit" className="btn btn-primary w-100 rounded-3 fw-bold py-2 mb-2">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
