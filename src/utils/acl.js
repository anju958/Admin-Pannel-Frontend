// src/utils/acl.js

// ----- MODULE KEYS used everywhere (keep these consistent) -----
export const MODULES = {
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
  complaints: "Complaints",
  noticeBoard: "Notice Board",
  company: "Company Settings",
  salaries: "Salaries"
};

// ----- ROLE PRESETS (as per your requirement) -----
const ALL_KEYS = Object.keys(MODULES);

export const ROLE_PRESETS = {
  superadmin: ALL_KEYS,              // everything
  manager: ALL_KEYS,                 // same as superadmin
  admin: [
    "leads",
    "clients",
    "proposals",
    "projects",
    "attendance",
    "trainees"
  ],
  accountant: [
    "invoices",
    "proposals",
    "attendance",
    "salaries"
  ],
  hr: [
    "attendance",
    "salaries",
    "trainees",
    "employees",
    "jobOpenings",
    "leads",
    "clients"
  ],
};

// ----- BASIC CHECKS -----

/**
 * canView: true if role preset includes module OR user.permissions[module] contains "View"
 * user.permissions is expected like:
 * {
 *   employees: ["Add","Edit","View","Delete"],
 *   invoices: ["View"]
 * }
 */
export function canView(user, moduleKey) {
  if (!user) return false;
  const role = (user.role || "").toLowerCase();

  // superadmin / manager see everything
  if (role === "superadmin" || role === "manager") return true;

  // role preset
  if (ROLE_PRESETS[role]?.includes(moduleKey)) return true;

  // granular permission
  const perms = user.permissions?.[moduleKey];
  return Array.isArray(perms) && perms.includes("View");
}

/**
 * canDo: check granular actions Add/Edit/Delete/View for a module
 * falls back to role preset for View if you want
 */
export function canDo(user, moduleKey, action) {
  if (!user) return false;
  const role = (user.role || "").toLowerCase();

  // superadmin / manager can do everything
  if (role === "superadmin" || role === "manager") return true;

  const actions = user.permissions?.[moduleKey] || [];
  return Array.isArray(actions) && actions.includes(action);
}
