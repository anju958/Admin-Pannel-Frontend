export const ROLE_PRESETS = {
  superadmin: "ALL",
  manager: "ALL",

  admin: [
    "leads",
    "clients",
    "proposals",
    "projects",
    "attendance",
    "trainees"
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
    "salaries"
  ]
};
