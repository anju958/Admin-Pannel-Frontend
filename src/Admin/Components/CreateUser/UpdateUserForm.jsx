import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// ✅ All modules used in your HRM system
const MODULES = [
    "employees",
    "trainees",
    "clients",
    "leads",
    "projects",
    "proposals",
    "jobopenings",
    "invoices",
    "tasks",
    "services",
    "departments",
    "attendance",
    "notices",
    "salaries",
];

const PERMISSIONS = ["view", "add", "edit", "delete"];

const UpdateUserForm = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        role: "admin",
        department: "",
        password: "",
        permissions: {}
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    // ✅ Fetch user data
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/getAdminbyUsers/${id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });

                const u = res.data.user;

                // ✅ Ensure permissions are always objects of booleans
                let fixedPermissions = {};
                Object.keys(u.permissions || {}).forEach((mod) => {
                    fixedPermissions[mod] = {
                        view: u.permissions[mod]?.view || false,
                        add: u.permissions[mod]?.add || false,
                        edit: u.permissions[mod]?.edit || false,
                        delete: u.permissions[mod]?.delete || false,
                    };
                });


                setFormData({
                    name: u.name,
                    email: u.email,
                    role: u.role,
                    department: u.department,
                    password: "",
                    permissions: fixedPermissions
                });

                setLoading(false);
            } catch (err) {
                setError("Failed to load user.");
                setLoading(false);
            }
        };

        fetchUser();
    }, [id]);

    // ✅ Handle simple input change
    const handleChange = (e) =>
        setFormData({ ...formData, [e.target.name]: e.target.value });

    // ✅ Toggle permission
    const togglePermission = (module, perm) => {
        setFormData((prev) => ({
            ...prev,
            permissions: {
                ...prev.permissions,
                [module]: {
                    ...prev.permissions[module],
                    [perm]: !prev.permissions[module][perm],
                },
            },
        }));
    };

    // ✅ Submit update
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setError("");

        try {
            await axios.put(
                `${API_URL}/api/users/update/${id}`,
                formData,
                {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                }
            );

            alert("User updated successfully!");
            navigate(-1);
        } catch (err) {
            setError("Update failed");
            setSaving(false);
        }
    };

    if (loading) return <div className="p-4">Loading user...</div>;
    if (error) return <div className="alert alert-danger mt-4">{error}</div>;

    return (
        <div className="container my-4">
            <div className="card p-4 shadow col-lg-10 mx-auto">
                <h3 className="mb-4 text-primary fw-bold">Update User Account</h3>

                <form onSubmit={handleSubmit}>
                    {/* Basic Fields */}
                    <div className="row g-4 mb-3">
                        <div className="col-md-6">
                            <label className="form-label">Full Name</label>
                            <input
                                name="name"
                                className="form-control"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Email</label>
                            <input
                                name="email"
                                className="form-control"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">Role</label>
                            <select
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="form-select"
                            >
                                <option value="admin">Admin</option>
                                <option value="superadmin">Superadmin</option>
                                <option value="hr">HR</option>
                                <option value="accountant">Accountant</option>
                                <option value="manager">Manager</option>
                            </select>
                        </div>

                        <div className="col-md-6">
                            <label className="form-label">New Password</label>
                            <input
                                name="password"
                                type="password"
                                className="form-control"
                                placeholder="Leave empty to keep old password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Permissions Table */}
                    <h5 className="fw-bold mb-3">Module Permissions</h5>

                    <div className="table-responsive">
                        <table className="table table-bordered text-center align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th>Module</th>
                                    {PERMISSIONS.map((p) => (
                                        <th key={p}>{p.toUpperCase()}</th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {Object.keys(formData.permissions).map((mod) => (
                                    <tr key={mod}>
                                        <td className="fw-semibold text-capitalize">{mod}</td>

                                        {PERMISSIONS.map((perm) => (
                                            <td key={perm}>
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions[mod]?.[perm] || false}
                                                    onChange={() =>
                                                        togglePermission(mod, perm)
                                                    }
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Buttons */}
                    <div className="d-flex justify-content-end gap-3 mt-3">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => navigate(-1)}
                            disabled={saving}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="btn btn-primary"
                            disabled={saving}
                        >
                            {saving ? "Updating..." : "Update User"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateUserForm;
