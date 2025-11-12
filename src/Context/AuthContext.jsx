// import React, { createContext, useState, useEffect } from "react";
// import axios from "axios";
// import { API_URL } from "../config";

// export const AuthContext = createContext();

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     if (!token) {
//       setLoading(false);
//       return;
//     }
//     // Fetch user using token from backend
//     axios
//       .get(`${API_URL}/api/users/me`, {
//         headers: { Authorization: `Bearer ${token}` },
//       })
//       .then((res) => {
//         setUser(res.data.user);
//       })
//       .catch(() => {
//         localStorage.removeItem("token");
//         setUser(null);
//       })
//       .finally(() => setLoading(false));
//   }, []);

//   const login = ({ token, user }) => {
//     localStorage.setItem("token", token);
//     setUser(user);
//   };

//   const logout = () => {
//     localStorage.removeItem("token");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout, loading }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import { API_URL } from "../config";

export const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext); // 👈 helper for other contexts (like ChatContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token") || null); // 👈 add token state
  const [loading, setLoading] = useState(true);

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
        setUser(res.data.user);
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const login = ({ token, user }) => {
    localStorage.setItem("token", token);
    setToken(token); // 👈 also update token state
    setUser(user);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token, // 👈 include token in context
        login,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
