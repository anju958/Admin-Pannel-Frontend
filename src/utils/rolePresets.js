export const ROLE_PRESETS = {
  superadmin: "ALL",
  manager: "ALL",

  admin: [
    "leads",
    "clients",
    "proposals",
    "projects",
    "attendance",
    "trainees",
    "employees",
    "jobOpenings",
    "tasks"
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

  accountant: [
    "invoices",
    "proposals",
    "attendance",
    "employees",
    "salaries"
  ]
};
