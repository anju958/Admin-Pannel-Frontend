import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'

function Service() {
  const [services, setServices] = useState([])
  const navigate = useNavigate()

  // Fetch services
  const fetchServices = () => {
    axios.get('http://localhost:5000/api/getServices')
      .then(res => {
        if (res.data) {
          setServices(res.data)
        } else {
          alert(res.data.Error)
        }
      })
      .catch(err => console.error("Error fetching services:", err))
  }

  useEffect(() => {
    fetchServices()
  }, [])

  // Delete service
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this service?")) {
      try {
        await axios.delete(`http://localhost:5000/api/deleteService/${id}`)
        alert("Service deleted successfully")
        fetchServices() 
      } catch (error) {
        console.error(error)
        alert("Error deleting service")
      }
    }
  }

  // Navigate to update form
  const handleUpdate = (id) => {
    navigate(`/admin/updateService/${id}`)
  }

  // Group services by department
  const groupedServices = services.reduce((acc, service) => {
    const deptName = service.deptId?.deptName || "Unknown Department"
    if (!acc[deptName]) acc[deptName] = []
    acc[deptName].push(service)
    return acc
  }, {})

  return (
    <div className="container py-5" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Header */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold" style={{ color: "#1f3b98" }}>
              ⚙️ Services by Department
            </h2>
            <Link
              to="/admin/addService"
              className="btn px-4 py-2 fw-bold rounded-pill"
              style={{
                background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                color: "white",
                boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
              }}
            >
              ➕ Add Service
            </Link>
          </div>

          {/* Accordion */}
          <div className="accordion" id="deptAccordion">
            {Object.keys(groupedServices).length > 0 ? (
              Object.keys(groupedServices).map((deptName, index) => (
                <div className="accordion-item border-0 mb-3 shadow-sm rounded-3" key={deptName}>
                  <h2 className="accordion-header" id={`heading-${index}`}>
                    <button
                      className={`accordion-button fw-semibold ${index !== 0 ? "collapsed" : ""}`}
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target={`#collapse-${index}`}
                      aria-expanded={index === 0 ? "true" : "false"}
                      aria-controls={`collapse-${index}`}
                      style={{ background: "#e9edff", color: "#1f3b98" }}
                    >
                      {deptName}
                    </button>
                  </h2>
                  <div
                    id={`collapse-${index}`}
                    className={`accordion-collapse collapse ${index === 0 ? "show" : ""}`}
                    aria-labelledby={`heading-${index}`}
                    data-bs-parent="#deptAccordion"
                  >
                    <div className="accordion-body bg-white rounded-bottom-3">
                      <div className="table-responsive">
                        <table className="table table-hover align-middle">
                          <thead style={{ background: "#1f3b98", color: "white" }}>
                            <tr>
                              <th style={{ width: "15%" }}>Service ID</th>
                              <th>Service Name</th>
                              <th>Price (₹)</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {groupedServices[deptName].map(service => (
                              <tr key={service._id}>
                                <td className="fw-semibold">{service.serviceId}</td>
                                <td>{service.serviceName}</td>
                                <td>₹{service.servicePrice}</td>
                                <td>
                                  <button
                                    onClick={() => handleUpdate(service._id)}
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
                                    onClick={() => handleDelete(service._id)}
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
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-muted py-5">
                No Services Found
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Service
