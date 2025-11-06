import React, { useEffect, useState } from "react";
import axios from "axios";
import { API_URL } from "../../../config";

function PermissionSelector({ permissions, setPermissions }) {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/api/getModule`)
      .then(res => setModules(res.data))
      .catch(() => setModules([]));
  }, []);

//   const handlePermissionChange = (moduleId, action, checked) => {
//     setPermissions(prev => {
//       const acts = prev[moduleId] || [];
//       return {
//         ...prev,
//         [moduleId]: checked
//           ? Array.from(new Set([...acts, action]))
//           : acts.filter(a => a !== action)
//       };
//     });
//   };

const handlePermissionChange = (moduleId, action, checked) => {
  setPermissions(prev => {
    const acts = prev[moduleId] || [];
    const updated = {
      ...prev,
      [moduleId]: checked
        ? Array.from(new Set([...acts, action]))
        : acts.filter(a => a !== action)
    };
    console.log("Permissions after change:", updated); // <-- Add this
    return updated;
  });
};


  const handleSelectAll = (moduleId, actions) => {
    setPermissions(prev => ({ ...prev, [moduleId]: actions }));
  };

  const handleDeselectAll = (moduleId) => {
    setPermissions(prev => ({ ...prev, [moduleId]: [] }));
  };

  return (
    <div>
      <h5 className="mb-3">Module Permissions</h5>
      {modules.map(mod => (
        <div key={mod._id} className="mb-4">
          <div className="d-flex align-items-center mb-2">
            <strong className="me-2">{mod.label}</strong>
            <button
              type="button"
              onClick={() => handleSelectAll(mod._id, mod.actions)}
              className="btn btn-xs btn-outline-success me-2 btn-sm"
            >Select All</button>
            <button
              type="button"
              onClick={() => handleDeselectAll(mod._id)}
              className="btn btn-xs btn-outline-secondary btn-sm"
            >Deselect All</button>
          </div>
          <div className="d-flex flex-wrap">
            {mod.actions.map(action => (
              <div key={action} className="form-check form-switch me-3 mb-2">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id={`${mod._id}-${action}`}
                  checked={permissions[mod._id]?.includes(action) || false}
                  onChange={e =>
                    handlePermissionChange(mod._id, action, e.target.checked)
                  }
                />
                <label className="form-check-label" htmlFor={`${mod._id}-${action}`}>
                  {action}
                </label>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default PermissionSelector;
