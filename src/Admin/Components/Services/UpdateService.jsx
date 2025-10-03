import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useParams, useNavigate } from 'react-router-dom'

function UpdateService() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [serviceName, setServiceName] = useState('')
  const [servicePrice, setServicePrice] = useState('')
  const [deptId, setDeptId] = useState('')
  const [departments, setDepartments] = useState([])

  // Fetch service by ID
  useEffect(() => {
    axios.get(`http://localhost:5000/api/getServiceById/${id}`)
      .then(res => {
        if (res.data) {
          setServiceName(res.data.serviceName)
          setServicePrice(res.data.servicePrice)
          setDeptId(res.data.deptId?._id || '')
        }
      })
      .catch(err => console.error(err))
  }, [id])

  // Fetch departments for dropdown
  useEffect(() => {
    axios.get('http://localhost:5000/api/getDepartment')
      .then(res => setDepartments(res.data))
      .catch(err => console.error(err))
  }, [])

  // Update service
  const handleUpdate = async (e) => {
    e.preventDefault()
    try {
      await axios.put(`http://localhost:5000/api/UpdateService/${id}`, {
        serviceName,
        servicePrice,
        deptId
      })
      alert('Service updated successfully')
      navigate('/admin/service')
    } catch (err) {
      console.error(err)
      alert('Error updating service')
    }
  }

  return (
    <div className="container py-5" style={{ background: "#f9faff", minHeight: "100vh" }}>
      <div className="row justify-content-center">
        <div className="col-lg-6">
          <div className="card shadow-lg border-0 rounded-4">
            <div className="card-body p-4">
              <h3 className="fw-bold mb-4 text-center" style={{ color: "#1f3b98" }}>
                ✏️ Update Service
              </h3>

              <form onSubmit={handleUpdate}>
                <div className="mb-3">
                  <label className="form-label fw-semibold">Service Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={serviceName}
                    onChange={(e) => setServiceName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Service Price (₹)</label>
                  <input
                    type="number"
                    className="form-control"
                    value={servicePrice}
                    onChange={(e) => setServicePrice(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold">Department</label>
                  <select
                    className="form-select"
                    value={deptId}
                    onChange={(e) => setDeptId(e.target.value)}
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map(dept => (
                      <option key={dept._id} value={dept._id}>
                        {dept.deptName}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="d-flex justify-content-between mt-4">
                  <button
                    type="button"
                    className="btn btn-secondary rounded-pill px-4 fw-semibold"
                    onClick={() => navigate('/admin/service')}
                  >
                    ⬅️ Back
                  </button>
                  <button
                    type="submit"
                    className="btn px-4 fw-bold rounded-pill"
                    style={{
                      background: "linear-gradient(90deg,#1f3b98,#3f65d6)",
                      color: "white",
                      boxShadow: "0px 4px 10px rgba(0,0,0,0.15)"
                    }}
                  >
                    💾 Save Changes
                  </button>
                </div>
              </form>

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UpdateService
