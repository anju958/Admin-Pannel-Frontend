import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateFormatter';
import StatusDropdown from '../Leads/StatusDropdown';
import { API_URL } from "../../../config";

function Lead() {
  const [Client, setClient] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`${API_URL}/api/getLeadData`)
      .then(res => {
        if (res.data) {
          setClient(res.data);

        } else {
          alert(res.data.Error);
        }
      });
  }, []);

  console.log(Client)
  const handleStatusChange = (leadId, newStatus) => {
    setClient(prev =>
      prev.map(client =>
        client.leadId === leadId ? { ...client, status: newStatus } : client
      )
    );
  };

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

  const handleDelete = async (leadId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) {
      return; // user clicked "Cancel"
    }

    try {
      await axios.delete(`${API_URL}/api/DeleteLead/${leadId}`);
      setClient(Client.filter(clients => clients.leadId !== leadId));
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
            <h3 className="fw-bold">
              👔 Lead List
            </h3>
          </div>
        </div>
      </div>

      {/* Add Lead Button */}
      <div className="d-flex justify-content-end mt-3 mb-2">
        <Link
          to="/admin/addClientLead"
          className="btn btn-dark rounded-pill fw-bold"
        >
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
              <th>Source</th>
              <th>Department</th>
              <th>Service</th>
              <th>Project Type</th>
              <th>Project Price</th>
              <th>Enroll Date</th>
              <th>Status & Update</th>
              {/* <th>Assigned To</th>
              <th>User Type</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              Client.map((clients, index) => (
                <tr key={index}>
                  <td>{clients.leadId}</td>
                  <td>{clients.leadName}</td>
                  <td>{clients.emailId}</td>
                  <td>{clients.phoneNo}</td>
                  <td>{clients.sourse}</td>
                  <td>{clients.department?.deptName}</td>
                  <td>{clients.service?.serviceName}</td>
                  <td>{clients.project_type}</td>
                  <td>{clients.project_price}</td>
                  <td>{formatDate(clients.date)}</td>
                  <td >
                    
                    {clients.status}
                  </td>
                  
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
            }
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Lead;
