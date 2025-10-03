
import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../../../utils/dateFormatter";

function Clients() {
  const [Client, setClient] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/getClientData")
      .then((res) => {
        if (res.data) {
          setClient(res.data);
        } else {
          alert(res.data.Error);
        }
      })
      .catch((err) => console.error(err));
  }, []);
  console.log(Client);

  const handleDelete = async (leadId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this client?"
    );
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/DeleteLead/${leadId}`);
      setClient(Client.filter((clients) => clients.leadId !== leadId));
      alert("Client deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete Client");
    }
  };

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

      {/* Add Client Button */}
      <div className="d-flex justify-content-end mt-3 mb-2">
        <Link
          to="/admin/addClientLead"
          className="btn btn-dark rounded-pill fw-bold"
        >
          ➕ Add Client
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
              <th>Status</th>
              {/* <th>Assigned To</th>
              <th>User Type</th> */}
              {/* <th>View</th> */}
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {Client.map((clients, index) => (
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
                <td>{clients.sourse}</td>
                <td>{clients.department?.deptName}</td>
                <td>{clients.service?.serviceName}</td>
                <td>{clients.project_type}</td>
                <td>{clients.project_price}</td>
                <td>{formatDate(clients.date)}</td>
                <td>{clients.status}</td>
                <td>
                  <div className="d-flex justify-content-center gap-2">
                    <button
                      className="btn btn-sm btn-primary rounded-pill"
                      onClick={() =>
                        navigate(`/admin/viewclientpage/${clients.leadId}`)
                      }
                    >
                      View
                    </button>
                    <button
                      className="btn btn-sm btn-primary rounded-pill"
                      onClick={() =>
                        navigate(`/admin/updateLeadClient/${clients.leadId}`)
                      }
                    >
                      Update
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
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Clients;
