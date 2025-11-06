import React, { useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../config";
import CreateUserAcc from "./CreateUserAcc";
import { Link } from 'react-router-dom';
import { useParams, useNavigate } from "react-router-dom";

function CreateUserPage() {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const navigate = useNavigate();
  async function fetchUsers() {
    try {
      const res = await axios.get(`${API_URL}/api/getAllAdminUser`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      setUsers(res.data.users || []);
    } catch {
      setUsers([]);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [showForm]);
  const handleDelete = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?"))
      return;
    try {
      await axios.delete(`${API_URL}/api/deleteAdminByUser/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      fetchUsers(); // Refresh user list after deletion
    } catch (err) {
      alert("Failed to delete user.");
    }
  };

  return (
    <div className="admin-users-page bg-light min-vh-100 py-4">
      <div className="custom-container mb-4">
        <div className="admin-header d-flex justify-content-between align-items-center mb-3 p-3 rounded shadow-sm bg-gradient-primary">
          <h2 className="fw-bold text-white m-0">Users Managed by Superadmin</h2>
          <Link
            to="/admin/createUserSAcc"
            className="btn btn-primary px-4 py-2 rounded-pill shadow"
            style={{ fontWeight: 600, letterSpacing: 0.5 }}
          >
            + Create User
          </Link>
        </div>
        <div className="card p-4 border-0 shadow-sm rounded-4">
          {users.length === 0 && <p>No users found.</p>}
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr style={{ fontSize: "1.07rem" }}>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Permissions</th>
                  <th style={{ textAlign: "center" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id} className="table-row">
                    <td className="fw-semibold">{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`badge rounded-pill bg-${user.role === "superadmin" ? "primary" : "secondary"}`}>
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    </td>
                    <td>
                      <ul className="mb-0 ps-3" style={{ fontSize: "0.98rem", lineHeight: 1.4 }}>
                        {user.permissions &&
                          Object.entries(user.permissions).map(([mod, perms]) => (
                            <li key={mod}><strong>{mod}:</strong> {perms.join(", ")}</li>
                          ))
                        }
                      </ul>
                    </td>
                    <td style={{ textAlign: "center" }}>
                      <button
                        className="btn btn-outline-primary btn-sm px-3 rounded-pill me-2"
                        onClick={() => navigate(`/admin/updateUserPermission/${user._id}`)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-outline-danger btn-sm px-3 rounded-pill"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        {showForm && (
          <div className="modal show fade" tabIndex="-1" style={{ display: "block", background: "rgba(0,0,0,0.3)" }}>
            <div className="modal-dialog modal-lg">
              <div className="modal-content rounded-4">
                <div className="modal-header border-0">
                  <h5 className="modal-title text-primary fw-bold">{editUser ? "Edit User" : "Create User"}</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => { setShowForm(false); setEditUser(null); }}
                  />
                </div>
                <div className="modal-body">
                  <CreateUserAcc
                    editUser={editUser}
                    closeForm={() => { setShowForm(false); setEditUser(null); }}
                    refresh={fetchUsers}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );


}
export default CreateUserPage;
