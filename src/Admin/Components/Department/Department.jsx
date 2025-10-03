import axios from 'axios'
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

function Department() {
  const [Dept, setDept] = useState([])
  const navigate = useNavigate()

  
  const fetchDepartments = () => {
    axios.get('http://localhost:5000/api/getDepartment')
      .then(res => {
        if (res.data) {
          setDept(res.data)
        } else {
          alert(res.data.Error)
        }
      })
      .catch(err => console.error(err))
  }

  useEffect(() => {
    fetchDepartments()
  }, [])

 
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await axios.delete(`http://localhost:5000/api/deleteDepartment/${id}`)
        alert("Department deleted successfully")
        fetchDepartments() 
      } catch (error) {
        console.error(error)
        alert("Error deleting department")
      }
    }
  }

 
  const handleUpdate = (id) => {
    navigate(`/admin/updateDepartment/${id}`)
  }

  return (
    <div className="container py-5" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: "#1f3b98" }}>
              🏢 Department List
            </h2>
            <Link
              to="/admin/addDepartment"
              className="btn px-4 py-2 fw-bold rounded-pill"
              style={{
                background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                color: "white",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
              }}
            >
              ➕ Add Department
            </Link>
          </div>

          {/* Table Section */}
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead style={{ background: "#1f3b98", color: "white" }}>
                    <tr>
                      <th style={{ width: "20%" }}>Dept. ID</th>
                      <th>Department Name</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Dept.length > 0 ? (
                      Dept.map((dept) => (
                        <tr key={dept._id}>
                          <td className="fw-semibold">{dept.deptId}</td>
                          <td>{dept.deptName}</td>
                          <td>
                            <button
                              onClick={() => handleUpdate(dept._id)}
                              className="btn btn-sm btn-warning me-2 px-3 rounded-pill fw-semibold"
                              style={{
                                background: "linear-gradient(90deg,#f0ad4e,#ec971f)",
                                color: "white",
                                border: "none",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                              }}
                            >
                              ✏️ Update
                            </button>

                            <button
                              onClick={() => handleDelete(dept._id)}
                              className="btn btn-sm btn-danger px-3 rounded-pill fw-semibold"
                              style={{
                                background: "linear-gradient(90deg,#d9534f,#c9302c)",
                                color: "white",
                                border: "none",
                                boxShadow: "0 2px 6px rgba(0,0,0,0.2)"
                              }}
                            >
                              🗑️ Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3" className="text-center text-muted py-4">
                          No Departments Found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}

export default Department
