import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'

function Service() {
  const [services, setServices] = useState([])

  useEffect(() => {
    axios.get('http://localhost:5000/api/getServices')
      .then(res => {
        if (res.data) {
          setServices(res.data)
        } else {
          alert(res.data.Error)
        }
      })
      .catch(err => console.error("Error fetching services:", err))
  }, [])

 
  const groupedServices = services.reduce((acc, service) => {
    const deptName = service.deptId?.deptName || "Unknown Department"
    if (!acc[deptName]) acc[deptName] = []
    acc[deptName].push(service)
    return acc
  }, {})

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-12'>
          <form>
            <h3 className='text-center'>View Services</h3>
            <div className='form-input m-3'>
              <Link to="/admin/addService"
                type="button"
                className="btn bg-dark-subtle w-10 rounded-pill fw-bold">
                Add Service
              </Link>
            </div>
          </form>

        
          <div className="accordion mt-4" id="deptAccordion">
            {Object.keys(groupedServices).map((deptName, index) => (
              <div className="accordion-item" key={deptName}>
                <h2 className="accordion-header" id={`heading-${index}`}>
                  <button
                    className={`accordion-button ${index !== 0 ? "collapsed" : ""}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse-${index}`}
                    aria-expanded={index === 0 ? "true" : "false"}
                    aria-controls={`collapse-${index}`}
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
                  <div className="accordion-body">
                    <table className="table table-bordered table-striped">
                      <thead className="table-dark">
                        <tr>
                          <th>Service ID</th>
                          <th>Service Name</th>
                        </tr>
                      </thead>
                      <tbody>
                        {groupedServices[deptName].map(service => (
                          <tr key={service._id}>
                            <td>{service.serviceId}</td>
                            <td>{service.serviceName}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  )
}

export default Service
