
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";

const modules = ["Job Opening", "Employees"];
const possiblePermissions = ["View", "Edit", "Add", "Delete"];

const UpdateUserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "admin",
        department: "",
        password: "",
        permissions: {}
    });
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    useEffect(() => {
        const fetchUser = async () => {
            try {
                // Use correct backend endpoint as per your screenshot
                const res = await axios.get(`${API_URL}/api/getAdminbyUsers/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                const user = res.data.user;
                setFormData({
                    name: user.name || "",
                    email: user.email || "",
                    role: user.role || "admin",
                    department: user.department || "",
                    password: "",
                    permissions: user.permissions || {}
                });
                setLoading(false);
            } catch (e) {
                setError("Failed to load user.");
                setLoading(false);
            }
        };
        fetchUser();
    }, [id]);



    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePermissionChange = (module, perm) => {
        const currPerms = formData.permissions[module] || [];
        const updatePerms = currPerms.includes(perm)
            ? currPerms.filter((p) => p !== perm)
            : [...currPerms, perm];
        setFormData({
            ...formData,
            permissions: {
                ...formData.permissions,
                [module]: updatePerms
            }
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");
        try {
            // Adjust endpoint here if needed
            await axios.put(`${API_URL}/api/users/update/${id}`, formData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });
            navigate(-1);
        } catch (e) {
            setError("Update failed!");
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-4">Loading user...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;

    return (
        <div className="container my-5">
            <div className="card p-4 shadow-sm col-lg-8 mx-auto">
                <h2 className="mb-4 text-primary fw-semibold">Update User Permissions</h2>
                <form onSubmit={handleSubmit} className="p-3">
                    <div className="row g-4 mb-2">
                        <div className="col-md-6">
                            <label className="form-label">Name</label>
                            <input name="name" className="form-control" value={formData.name} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input name="email" className="form-control" value={formData.email} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Role</label>
                            <select name="role" className="form-select" value={formData.role} onChange={handleChange}>
                                <option value="admin">Admin</option>
                                <option value="superadmin">Superadmin</option>
                            </select>
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Password</label>
                            <input name="password" className="form-control" type="password" value={formData.password} onChange={handleChange} placeholder="Leave blank to keep old password" />
                        </div>
                    </div>
                    <div className="mb-4">
                        <label className="form-label fw-bold">Permissions:</label>
                        <div className="table-responsive">
                            <table className="table table-bordered align-middle">
                                <thead className="table-light">
                                    <tr>
                                        <th>Module</th>
                                        {possiblePermissions.map((perm) => (
                                            <th key={perm}>{perm}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {modules.map((mod) => (
                                        <tr key={mod}>
                                            <td>{mod}</td>
                                            {possiblePermissions.map((perm) => (
                                                <td key={perm} className="text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            Array.isArray(formData.permissions[mod])
                                                                ? formData.permissions[mod].includes(perm)
                                                                : false
                                                        }
                                                        onChange={() => handlePermissionChange(mod, perm)}
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="d-flex justify-content-end gap-3">
                        <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)} disabled={submitting}>
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary" disabled={submitting}>
                            {submitting ? "Updating..." : "Update User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserForm;
