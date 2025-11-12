import React from "react";
import { ROLE_PRESETS } from "../../../utils/rolePresets";

const MODULE_LABELS = {
  home: "Home",
  jobOpenings: "Job Openings",
  departments: "Departments",
  employees: "Employees",
  trainees: "Trainees",
  attendance: "Attendance",
  leads: "Leads",
  clients: "Clients",
  proposals: "Proposals",
  invoices: "Invoices",
  reports: "Reports",
  projects: "Projects",
  users: "User Management",
  salaries: "Salaries",
  noticeBoard: "Notice Board",
  company: "Company Settings",
};

const ACTIONS = ["Add", "Edit", "View", "Delete"];

export default function PermissionSelector({ permissions, setPermissions, role }) {
  // Determine which modules should show
  let allowedModules = [];

  if (!role) {
    allowedModules = []; // no role selected yet
  } else if (ROLE_PRESETS[role] === "ALL") {
    allowedModules = Object.keys(MODULE_LABELS);
  } else {
    allowedModules = ROLE_PRESETS[role];
  }

  const toggle = (moduleKey, action) => {
    const current = permissions[moduleKey] || [];
    const updated = current.includes(action)
      ? current.filter(a => a !== action)
      : [...current, action];

    setPermissions({ ...permissions, [moduleKey]: updated });
  };

  const selectAll = (moduleKey) => {
    setPermissions({
      ...permissions,
      [moduleKey]: [...ACTIONS],
    });
  };

  const deselectAll = (moduleKey) => {
    const copy = { ...permissions };
    delete copy[moduleKey];
    setPermissions(copy);
  };

  return (
    <div className="card mt-3">
      <div className="card-header fw-bold">Module Permissions</div>
      <div className="card-body">

        {allowedModules.length === 0 && (
          <p className="text-muted">Select a role to see permissions.</p>
        )}

        {allowedModules.map((key) => (
          <div key={key} className="mb-3 border rounded p-3">
            <div className="d-flex justify-content-between align-items-center">
              <h6 className="mb-0">{MODULE_LABELS[key]}</h6>

              <div>
                <button className="btn btn-sm btn-outline-primary me-2" type="button" onClick={() => selectAll(key)}>
                  Select All
                </button>
                <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => deselectAll(key)}>
                  Deselect All
                </button>
              </div>
            </div>

            <div className="mt-2 d-flex flex-wrap gap-3">
              {ACTIONS.map((a) => (
                <label key={a} className="form-check form-switch">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    checked={permissions[key]?.includes(a) || false}
                    onChange={() => toggle(key, a)}
                  />
                  <span className="ms-2">{a}</span>
                </label>
              ))}
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}
