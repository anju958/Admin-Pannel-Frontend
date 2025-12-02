import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";
import { API_URL } from "../../../config";
import { AuthContext } from "../../../Context/AuthContext";

// Permission helpers
const canDo = (user, module, action) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.[action] === true;
};

const canViewPage = (user, module) => {
  if (user?.role === "superadmin" || user?.role === "manager") return true;
  return user?.permissions?.[module]?.view === true;
};

function Clients() {
  const [Client, setClient] = useState([]);
  const [search, setSearch] = useState("");   // ✅ NEW
  const [filtered, setFiltered] = useState([]); // ✅ NEW

  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Fetch all clients
  useEffect(() => {
    axios
      .get(`${API_URL}/api/getClientData`)
      .then((res) => {
        if (res.data) {
          setClient(res.data);
          setFiltered(res.data); // ✅ set filtered also
        } else {
          alert("Failed to load clients");
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Delete client
  const handleDelete = async (leadId) => {
    if (!canDo(user, "clients", "delete")) {
      return alert("You do not have permission to delete clients.");
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/DeleteLead/${leadId}`);

      const updated = Client.filter((c) => c.leadId !== leadId);

      setClient(updated);
      setFiltered(updated); // 🔥 update filtered also

      alert("Client deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete client");
    }
  };

  // Page access check
  if (!canViewPage(user, "clients")) {
    return (
      <div className="container py-5 text-center">
        <h2 className="text-danger fw-bold">🚫 Access Denied</h2>
        <p>You do not have permission to view Clients.</p>
      </div>
    );
  }

  return (
    <div className="container-fluid">

      {/* Page Header */}
      <div className="row">
        <div className="col-md-12">
          <div className="bg-success text-white text-center py-3 shadow rounded-bottom">
            <h3 className="fw-bold">👥 Client List</h3>
          </div>
        </div>
      </div>

      {/* Add Client */}
      {canDo(user, "clients", "add") && (
        <div className="d-flex justify-content-start mt-3 mb-2">
          <Link
            to="/admin/addClientLead"
            className="btn btn-dark rounded-pill fw-bold"
          >
            ➕ Add Client
          </Link>
        </div>
      )}

      {/* ✅ SEARCH INPUT */}
      <input
        type="text"
        className="form-control mb-3"
        placeholder="Search client..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Department</th>
              <th>Service</th>
              <th>Project Price</th>
              <th>Enroll Date</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered
              .filter((c) => {
                const q = search.toLowerCase();
                return (
                  c.leadId?.toLowerCase().includes(q) ||
                  c.leadName?.toLowerCase().includes(q) ||
                  c.emailId?.toLowerCase().includes(q) ||
                  c.phoneNo?.toLowerCase().includes(q) ||
                  c.department?.deptName?.toLowerCase().includes(q) ||
                  c.service?.serviceName?.toLowerCase().includes(q)
                );
              })
              .map((clients, index) => (
                <tr key={index}>
                  <td>{clients.leadId}</td>
                  <td>{clients.leadName}</td>

                  <td
                    className="text-truncate"
                    style={{ maxWidth: "180px" }}
                    title={clients.emailId}
                  >
                    {clients.emailId}
                  </td>

                  <td>{clients.phoneNo}</td>
                  <td>{clients.department?.deptName}</td>
                  <td>{clients.service?.serviceName}</td>
                  <td>{clients.project_price}</td>
                  <td>{formatDate(clients.date)}</td>

                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      {/* View */}
                      {canDo(user, "clients", "view") && (
                        <button
                          className="btn btn-sm btn-primary rounded-pill"
                          onClick={() =>
                            navigate(`/admin/viewclientpage/${clients.leadId}`)
                          }
                        >
                          View
                        </button>
                      )}

                      {/* Update */}
                      {canDo(user, "clients", "edit") && (
                        <button
                          className="btn btn-sm btn-primary rounded-pill"
                          onClick={() =>
                            navigate(`/admin/updateLeadClient/${clients.leadId}`)
                          }
                        >
                          Update
                        </button>
                      )}

                      {/* Delete */}
                      {canDo(user, "clients", "delete") && (
                        <button
                          className="btn btn-sm btn-danger rounded-pill"
                          onClick={() => handleDelete(clients.leadId)}
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default Clients;
