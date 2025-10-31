import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateFormatter';
import { API_URL } from "../../../config";

function Lead() {
  const [Client, setClient] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [stats, setStats] = useState({
    total: 0,
    cold: 0,
    warm: 0,
    inProgress: 0,
    win: 0,
    closed: 0
  });

  const navigate = useNavigate();

  // ✅ Fetch Leads Data
  useEffect(() => {
    axios.get(`${API_URL}/api/getLeadData`)
      .then(res => {
        if (res.data) {
          setClient(res.data);
          setFiltered(res.data);
          calculateStats(res.data);
        } else {
          alert(res.data.Error);
        }
      })
      .catch(err => console.error(err));
  }, []);

  // ✅ Calculate status-based summary
  const calculateStats = (data) => {
    const total = data.length;
    const cold = data.filter(l => l.status === 'Cold').length;
    const warm = data.filter(l => ['Warm', 'Hot'].includes(l.status)).length;
    const inProgress = data.filter(l =>
      ['Schedule Appointment', 'Proposal sent', 'Hold'].includes(l.status)
    ).length;
    const win = data.filter(l => l.status === 'Win').length;
    const closed = data.filter(l => ['Close', 'Other'].includes(l.status)).length;

    setStats({ total, cold, warm, inProgress, win, closed });
  };

  // ✅ Filter table data by status
  const handleCardClick = (statusKey) => {
    if (selectedStatus === statusKey) {
      // toggle off (show all)
      setFiltered(Client);
      setSelectedStatus("All");
      return;
    }

    setSelectedStatus(statusKey);
    let filteredData = [];

    switch (statusKey) {
      case "Cold":
        filteredData = Client.filter(l => l.status === "Cold");
        break;
      case "Warm":
        filteredData = Client.filter(l => ["Warm", "Hot"].includes(l.status));
        break;
      case "InProgress":
        filteredData = Client.filter(l =>
          ["Schedule Appointment", "Proposal sent", "Hold"].includes(l.status)
        );
        break;
      case "Win":
        filteredData = Client.filter(l => l.status === "Win");
        break;
      case "Closed":
        filteredData = Client.filter(l => ["Close", "Other"].includes(l.status));
        break;
      default:
        filteredData = Client;
    }
    setFiltered(filteredData);
  };

  // ✅ Move Lead to Client
  const moveToClient = async (leadId) => {
    try {
      const res = await axios.put(`${API_URL}/api/moveleadtoClient/${leadId}`);
      if (res.status === 200) {
        alert("Lead moved to client successfully!");
        navigate("/admin/client");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to move lead to client");
    }
  };

  // ✅ Delete Lead
  const handleDelete = async (leadId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`${API_URL}/api/DeleteLead/${leadId}`);
      const updatedClients = Client.filter(clients => clients.leadId !== leadId);
      setClient(updatedClients);
      setFiltered(updatedClients);
      calculateStats(updatedClients);
      alert("User deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete User");
    }
  };

  return (
    <div className="container-fluid">
      {/* Page Header */}
      <div className="row">
        <div className="col-md-12">
          <div className="bg-primary text-white text-center py-3 shadow rounded-bottom">
            <h3 className="fw-bold">👔 Lead List</h3>
          </div>
        </div>
      </div>

      {/* ✅ Summary Report Cards */}
      <div className="row mt-4 mb-4 text-center">
        <div className="col-md-2 mb-3">
          <div
            className={`card shadow border-primary ${selectedStatus === "All" ? "bg-light" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick("All")}
          >
            <div className="card-body">
              <h6 className="text-primary">Total Leads</h6>
              <h4 className="fw-bold">{stats.total}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div
            className={`card shadow border-info ${selectedStatus === "Cold" ? "bg-info-subtle" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick("Cold")}
          >
            <div className="card-body">
              <h6 className="text-info">Cold</h6>
              <h4 className="fw-bold">{stats.cold}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div
            className={`card shadow border-warning ${selectedStatus === "Warm" ? "bg-warning-subtle" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick("Warm")}
          >
            <div className="card-body">
              <h6 className="text-warning">Warm / Hot</h6>
              <h4 className="fw-bold">{stats.warm}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div
            className={`card shadow border-secondary ${selectedStatus === "InProgress" ? "bg-secondary-subtle" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick("InProgress")}
          >
            <div className="card-body">
              <h6 className="text-secondary">In Progress</h6>
              <h4 className="fw-bold">{stats.inProgress}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div
            className={`card shadow border-success ${selectedStatus === "Win" ? "bg-success-subtle" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick("Win")}
          >
            <div className="card-body">
              <h6 className="text-success">Won</h6>
              <h4 className="fw-bold">{stats.win}</h4>
            </div>
          </div>
        </div>

        <div className="col-md-2 mb-3">
          <div
            className={`card shadow border-danger ${selectedStatus === "Closed" ? "bg-danger-subtle" : ""}`}
            style={{ cursor: "pointer" }}
            onClick={() => handleCardClick("Closed")}
          >
            <div className="card-body">
              <h6 className="text-danger">Closed / Other</h6>
              <h4 className="fw-bold">{stats.closed}</h4>
            </div>
          </div>
        </div>
      </div>

      {/* Add Lead Button */}
      <div className="d-flex justify-content-start mt-3 mb-2">
        <Link to="/admin/addClientLead" className="btn btn-dark rounded-pill fw-bold">
          ➕ Add Lead
        </Link>
      </div>

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
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              filtered.length > 0 ? (
                filtered.map((clients, index) => (
                  <tr key={index}>
                    <td>{clients.leadId}</td>
                    <td>{clients.leadName}</td>
                    <td>{clients.emailId}</td>
                    <td>{clients.phoneNo}</td>
                    <td>{clients.department?.deptName}</td>
                    <td>{clients.service?.serviceName}</td>
                    <td>{clients.project_price}</td>
                    <td>{formatDate(clients.date)}</td>
                    <td>{clients.status}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button
                          className="btn btn-sm btn-primary rounded-pill"
                          onClick={() => navigate(`/admin/leadPage/${clients.leadId}`)}
                        >
                          View
                        </button>

                        <button
                          className="btn btn-sm btn-primary rounded-pill"
                          onClick={() => navigate(`/admin/updateLeadClient/${clients.leadId}`)}
                        >
                          Update
                        </button>

                        <button
                          className="btn btn-sm btn-primary rounded-pill"
                          onClick={() => moveToClient(clients.leadId)}
                        >
                          M→ Client
                        </button>

                        <button
                          className="btn btn-sm btn-danger rounded-pill"
                          onClick={() => handleDelete(clients.leadId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="text-center text-muted">
                    No leads found for selected filter.
                  </td>
                </tr>
              )
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Lead;
