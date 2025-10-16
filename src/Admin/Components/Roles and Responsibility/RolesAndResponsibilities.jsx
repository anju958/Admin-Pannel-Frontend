
import React, { useState } from 'react';
import axios from 'axios';
import { API_URL } from "../../../config";

function RolesAndResponsibilities() {
  const [selectRole, setSelectRole] = useState("");
  const [permissions, setPermissions] = useState({});

  const roles = [
    // For dynamic backend, fetch these and their IDs!
    { name: "admin", id: "68eb43bec923b9f3d01d13f6" },
    { name: "intern", id: "68eb493ec923b9f3d01d13fd" },
    { name: "client", id: "68eb494ec923b9f3d01d13ff" },
    { name: "employee", id: "68eb490fc923b9f3d01d13fb" }
  ];

  const departmentModules = {
    admin: ["Job Opening", "Departments", "Employees", "Intern"],
    intern: ["Job Opening", "Departments"],
    client: ["Proposals", "Invoices"],
    employee: ["Attendance", "Notice Board"]
  };

  const actions = ["Add", "Edit", "View", "Delete"];

  const handleChange = (module, action, checked) => {
    setPermissions(prev => {
      const modPerm = prev[module] || [];
      return {
        ...prev,
        [module]: checked
          ? [...new Set([...modPerm, action])]
          : modPerm.filter(a => a !== action)
      };
    });
  };

  // Select all actions for a module
  const handleSelectAll = module => {
    setPermissions(prev => ({
      ...prev,
      [module]: actions
    }));
  };

  // Deselect all actions for a module
  const handleDeselectAll = module => {
    setPermissions(prev => ({
      ...prev,
      [module]: []
    }));
  };

  const handleSave = () => {
    const selectedRoleObj = roles.find(role => role.name === selectRole);
    if (!selectedRoleObj) return alert('Invalid role, please select correctly.');

    Object.entries(permissions).forEach(([module, perms]) => {
      axios.post(`${API_URL}/api/roles/${selectedRoleObj.id}/permissions`, {
        moduleName: module,
        permissions: perms
      })
      .then(res => console.log(res.data))
      .catch(err => console.error(err));
    });
    alert("Permissions saved!");
  };

  return (
    <div className='container-fluid'>
      <div className='row'>
        <div className='col-md-12'>
          <div className="container mt-4">
            <h3 className="text-center">Roles and Responsibility</h3>
            <h6 className='text-center mt-2'>Select Department</h6>

            <select
              className="form-select w-50 mx-auto my-3"
              onChange={(e) => { setSelectRole(e.target.value); setPermissions({}); }}
            >
              <option value="">select</option>
              {roles.map((role, index) => (
                <option key={index} value={role.name}>{role.name}</option>
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
                    <button className="btn btn-sm btn-success me-2"
                      type="button"
                      onClick={() => handleSelectAll(module)}>
                      Select All
                    </button>
                    <button className="btn btn-sm btn-secondary"
                      type="button"
                      onClick={() => handleDeselectAll(module)}>
                      Deselect All
                    </button>
                    <div className="row mb-3 mt-2">
                      {actions.map((action, j) => (
                        <div className="col-md-3" key={j}>
                          <label className="fw-semibold">{action}</label>
                          <div className="form-check">
                            <input
                              type="checkbox"
                              className="form-check-input"
                              checked={permissions[module]?.includes(action) || false}
                              onChange={(e) => handleChange(module, action, e.target.checked)}
                            />
                            <label className="form-check-label">{action}</label>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <button className="btn btn-primary" onClick={handleSave}>Save Roles</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default RolesAndResponsibilities;
