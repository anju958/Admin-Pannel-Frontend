import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_URL } from "../../../config";
import { useNavigate } from 'react-router-dom';
import PermissionSelector from './PermissionSelector';

function CreateUserAcc({ editUser, closeForm, refresh }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    permissions: {}
  });

  const navigate = useNavigate();

  // Only set form state ONCE when editUser switches from undefined/null to present
  useEffect(() => {
    if (editUser && editUser._id) {
      setForm({
        name: editUser.name,
        email: editUser.email,
        password: "",
        role: editUser.role,
        permissions: editUser.permissions || {}
      });
    } else {
      // Only reset fields when creating new user, not on every render!
      setForm({
        name: "",
        email: "",
        password: "",
        role: "",
        permissions: {}
      });
    }
    // eslint-disable-next-line
  }, [editUser && editUser._id]); // depend only on editUser._id, not on every parent render

  const roles = [
    { name: "admin" },
    { name: "hr" },
    { name: "accountant" },
    { name: "manager" }

  ];

  function handleFieldChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const method = editUser && editUser._id ? "put" : "post";
    const url = editUser && editUser._id
      ? `${API_URL}/api/users/update/${editUser._id}`
      : `${API_URL}/api/users/create`;
    const payload = { ...form };
    if (!payload.password) delete payload.password;
    if (editUser && !editUser._id) {
      alert('Edit mode: user ID missing!');
      return;
    }
    try {
      await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      alert(editUser ? "User updated!" : "User created!");
      if (typeof closeForm === 'function') closeForm();
      if (typeof refresh === 'function') refresh();
    } catch (err) {
      if (err.response) {
        alert('Backend error: ' + (err.response.data.msg || JSON.stringify(err.response.data)));
      } else if (err.request) {
        alert('Network error, no backend response');
      } else {
        alert('Request setup error: ' + err.message);
      }
    }
  }

  return (
    <div className="container mt-3 mb-3">
      <button
        className="btn btn-outline-secondary mb-3"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>
      <div className="card shadow rounded-3 border-0">
        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
          <h4 className="mb-0">{editUser && editUser._id ? "Edit User Account" : "Create New User"}</h4>
        </div>
        <form className="card-body" style={{ background: "#f8f9fa" }} onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Full Name</label>
              <input name="name" className="form-control" placeholder="Full Name" value={form.name} onChange={handleFieldChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Email</label>
              <input name="email" className="form-control" placeholder="Email" value={form.email} onChange={handleFieldChange} required />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Password</label>
              <input name="password" type="password" className="form-control" placeholder={editUser ? "New Password (optional)" : "Password"} value={form.password} onChange={handleFieldChange} required={!editUser} />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Role</label>
              <select name="role" className="form-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value, permissions: {} }))} required>
                <option value="">Select Role</option>
                {roles.map((role, i) => (<option key={i} value={role.name}>{role.name}</option>))}
              </select>
            </div>
          </div>

          <PermissionSelector
            permissions={form.permissions}
            setPermissions={perms => setForm(f => ({ ...f, permissions: perms }))}
            role={form.role}
          />

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary px-4 shadow">{editUser && editUser._id ? "Update User" : "Create User"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateUserAcc;
