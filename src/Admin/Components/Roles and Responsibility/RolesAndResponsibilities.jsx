import React, { useState } from 'react'

function RolesAndResponsibilities() {
  const [selectRole, setSelectRole] = useState("")


  const roles = ["admin", "intern", "client", "employee"]

  const departmentModules = {
    admin: ["Job Opening", "Departments", "Employees", "Intern"],
    intern: ["Job Opening", "Departments"],
    client: ["Proposals", "Invoices"],
    employee: ["Attendance", "Notice Board"]
  }

  
  const actions = ["Add", "Edit", "View", "Delete"]

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-12'>
          <div className="container mt-4">
            <h3 className="text-center">Roles and Responsibility</h3>
            <h6 className='text-center mt-2'>Select Department</h6>

            <select
              className="form-select w-50 mx-auto my-3"
              onChange={(e) => { setSelectRole(e.target.value) }}
            >
              <option value="">select</option>
              {roles.map((role, index) => (
                <option key={index} value={role}>{role}</option>
              ))}
            </select>

        
            {selectRole && (
              <div className="card p-4 mb-4 shadow-sm bg-light">
                <div className="heading mb-3">
                  <h4 className="fw-bold text-capitalize">{selectRole} Permissions</h4>
                </div>

          
                {departmentModules[selectRole]?.map((module, i) => (
                  <div key={i} className="mb-5">
                    <h6 className="text-muted">{module}</h6>
                    <div className="row mb-3">
                      {actions.map((action, j) => (
                        <div className="col-md-3" key={j}>
                          <label className="fw-semibold">{action}</label>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input"  />
                            <label className="form-check-label" >All</label>
                          </div>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" />
                            <label className="form-check-label" >Create</label>
                          </div>
                          <div className="form-check">
                            <input type="checkbox" className="form-check-input" />
                            <label className="form-check-label" >
                              Not Allow to {action}
                            </label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary">Save Roles</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RolesAndResponsibilities
