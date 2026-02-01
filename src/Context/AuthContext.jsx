import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config";
import { initSocket, disconnectSocket } from "../socket";


export const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

/* ================================
   🔧 NORMALIZE PERMISSIONS (KEY FIX)
================================ */
const normalizePermissions = (permissions = {}) => {
  const normalized = {};

  Object.keys(permissions || {}).forEach((key) => {
    const cleanKey = key.toLowerCase().replace(/\s+/g, "");

    const value = permissions[key];

    // ARRAY → ["View","Add"]
    if (Array.isArray(value)) {
      normalized[cleanKey] = value;
    }

    // OBJECT → { view:true }
    else if (typeof value === "object" && value !== null) {
      normalized[cleanKey] = value;
    }
  });

  return normalized;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  /* ================================
     LOAD USER FROM TOKEN
  ================================ */
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    axios
      .get(`${API_URL}/api/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        const fetchedUser = res.data.user;

        setUser({
          ...fetchedUser,
          permissions: normalizePermissions(fetchedUser.permissions),
        });
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  /* ================================
   INIT SOCKET AFTER LOGIN
================================ */
useEffect(() => {
  if (!token || !user) return;

  // initialize socket once
  const socket = initSocket(token);

  // 🔔 join admin room ONLY for admins
  if (user.role === "admin") {
    socket.emit("join-admin");
  }

  return () => {
    // optional: disconnect on logout
    // disconnectSocket();
  };
}, [token, user]);

  /* ================================
     LOGIN
  ================================ */
  const login = ({ token, user }) => {
    localStorage.setItem("token", token);

    setToken(token);
    setUser({
      ...user,
      permissions: normalizePermissions(user.permissions),
    });
  };

useEffect(() => {
  if (!token || !user) return;

  // 1️⃣ initialize socket
  const socket = initSocket(token);

  // 2️⃣ join role-based room
  if (user.role) {
    socket.emit("join-role", user.role);
  }

  return () => {
    // optional cleanup on logout
    // disconnectSocket();
  };
}, [token, user]);


  /* ================================
     LOGOUT
  ================================ */
  // const logout = () => {
  //   localStorage.removeItem("token");
  //   setUser(null);
  //   setToken(null);
  // };
const logout = () => {
  localStorage.removeItem("token");
  disconnectSocket(); // 🔌 disconnect socket
  setUser(null);
  setToken(null);
};


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
