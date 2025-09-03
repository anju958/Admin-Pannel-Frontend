import axios from 'axios';
import { useEffect } from 'react';
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';


function Lead() {
  const [Lead, setLead] = useState([])
  const navigate = useNavigate()
  console.log(Lead);
  useEffect(() => {
    axios.get('http://localhost:5000/api/getLeadData')
      .then(res => {
        if (res.data) {
          setLead(res.data)
        }
        else {
          alert(res.data.Error)
        }
      })
  }, [])

    const movetoClient = async (leadId,userType) => {
    try {
      await axios.put(`http://localhost:5000/api/moveleadtoClient/${leadId}`, {userType})
      alert("Moved to Client successfully!")

      setLead(prev => prev.filter(lead => lead.leadId !== leadId))
    } catch (err) {
      console.error(err)
      alert("Error while moving to employee")
    }
  }

     const handleDelete = async (leadId) => {
        const answer = prompt("type Yes if you want to delete user");
        if (!answer || answer.toLowerCase() !== "yes") {
            alert("Delete cancelled!");
            return;
        }
        try {
            await axios.delete(`http://localhost:5000/api/DeleteLead/${leadId}`);
            setLead(Lead.filter(lead => lead.leadId !== leadId));
            alert("User deleted successfully!");
        } catch (error) {
            console.error(error);
            alert("Failed to delete User");
        }
    };

  return (
    <>
      <div className="container mt-4">
        <h3 className="mb-4 text-center p-3">Leads Management</h3>
        <div className='form-input m-3'>
          <Link to="/admin/addClientLead"
            type="submit"
            className="btn bg-dark-subtle  w-10 rounded-pill fw-bold">
            Add Lead
          </Link>
        </div>
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Source</th>
              <th>Service</th>
              <th>Date</th>
              <th>Status</th>
              <th>Assigned To</th>
              <th>User Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {
              Lead.map(lead => (
                <tr>
                  <td>{lead.leadId} </td>
                  <td>{lead.leadName}</td>
                  <td>{lead.emailId}</td>
                  <td>{lead.phoneNo}</td>
                  <td>{lead.sourse}</td>
                  <td>{lead.service}</td>
                  <td>{lead.date}</td>
                  <td>{lead.status}</td>
                  <td>{lead.assign}</td>
                  <td>{lead.userType}</td>
                  <td className="text-center">
                   <div className="d-flex justify-content-center gap-2">
                      <button  className="btn btn-sm btn-primary rounded-pill"
                      onClick={() => movetoClient(lead.leadId,"lead")}
                      >
                        Move to Client
                      </button>
                      <button
                          className="btn btn-sm btn-primary rounded-pill"
                          onClick={()=>{ navigate(`/admin/updateLeadClient/${lead.leadId}`)}}
                        >
                          Update
                        </button>
                      <button className="btn btn-sm btn-danger rounded-pill"
                      onClick={() => { handleDelete(lead.leadId) }}
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
    </>
  )
}

export default Lead