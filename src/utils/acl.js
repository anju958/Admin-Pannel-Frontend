export function canView(user, moduleKey) {
  if (!user) return false;

  const role = (user.role || "").toLowerCase();

  // ✅ Full access roles
  if (role === "superadmin" || role === "manager") return true;

  if (!user.permissions) return false;

  // 🔑 normalize key (VERY IMPORTANT)
  const key = moduleKey.toLowerCase();

  const perms = user.permissions[key];

  // ✅ Array format: ["View","Add"]
  if (Array.isArray(perms)) {
    return perms.includes("View");
  }

  // ✅ Object format: { view: true }
  if (typeof perms === "object" && perms !== null) {
    return perms.view === true;
  }

  return false;
}

export function canDo(user, moduleKey, action) {
  if (!user) return false;

  const role = (user.role || "").toLowerCase();

  // ✅ Full access roles
  if (role === "superadmin" || role === "manager") return true;

  if (!user.permissions) return false;

  const key = moduleKey.toLowerCase();
  const perms = user.permissions[key];

  if (Array.isArray(perms)) {
    return perms.includes(action);
  }

  if (typeof perms === "object" && perms !== null) {
    return perms[action.toLowerCase()] === true;
  }

  return false;
}
