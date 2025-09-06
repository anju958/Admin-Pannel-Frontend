import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { formatDate } from '../../../utils/dateFormatter';


function Lead() {

  const [Client, setClient] = useState([])
  const [userType, setUserType] = useState([])
  const navigate = useNavigate();
  console.log(Client);

  useEffect(() => {
    axios.get('http://localhost:5000/api/getLeadData')
      .then(res => {
        if (res.data) {
          setClient(res.data)
        }
        else {
          alert(res.data.Error)
        }
      })
  }, [])

  //  const moveToClient = async (leadId) => {
  //   try {
  //     const res = await axios.put(`http://localhost:5000/api/convertToClient/${leadId}`);
  //     alert(res.data.message);

  //     setClient(Client.map(c => 
  //       c.leadId === leadId ? { ...c, userType: "client" } : c
  //     ));

  //   } catch (error) {
  //     console.error(error);
  //     alert("Failed to move lead to client");
  //   }
  // };

  const moveToClient = async (leadId) => {
    try {

      const res = await axios.put(`http://localhost:5000/api/moveleadtoClient/${leadId}`);

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
    const answer = prompt("type Yes if you want to delete user");
    if (!answer || answer.toLowerCase() !== "yes") {
      alert("Delete cancelled!");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/DeleteLead/${leadId}`);
      setClient(Client.filter(clients => clients.leadId !== leadId));
      alert("User deleted successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to delete User");
    }
  };


  return (
    <>
      <div className="container">
        <h3 className="mb-4 text-center p-3"> Lead List</h3>
        <div className='form-input '>
          <Link to="/admin/addClientLead"
            type="submit"
            className="btn bg-dark-subtle  w-10 rounded-pill fw-bold">
            Add Lead
          </Link>
        </div>
        <table className="table table-bordered table-striped mt-3">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Service</th>
              <th>Project Type</th>
              <th>Project Price</th>
              <th>Start Date</th>
              <th>DeadLine</th>
              <th>Project Start Date</th>
              <th> Enroll Date</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              Client.map(clients => (
                <tr>
                  <td>{clients.leadId} </td>
                  <td>{clients.leadName}</td>
                  <td>{clients.emailId}</td>
                  <td>{clients.phoneNo}</td>
                  <td>{clients.sourse}</td>
                  <td>{clients.service}</td>
                  <td>{clients.project_type}</td>
                  <td>{formatDate(clients.project_price)}</td>
                  <td>{formatDate(clients.start_date)}</td>
                  <td>{formatDate(clients.deadline)}</td>
                  <td>{formatDate(clients.startProjectDate)}</td>
                  <td>{formatDate(clients.date)}</td>
                  <td>{clients.status}</td>
                  <td>{clients.assign}</td>
                  <td>{clients.userType}</td>
                  <td className="text-center">
                    <td className="text-center">
                      <div className="d-flex justify-content-center gap-2">
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
                          move to Client
                        </button>
                        <button
                          className="btn btn-sm btn-danger rounded-pill"
                          onClick={() => handleDelete(clients.leadId)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>


                  </td>

                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default Lead