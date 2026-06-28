import { createContext, useContext, useState, useEffect } from "react";
import api from "./api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // true until we've checked for an existing token

  // On first load, if a token is sitting in localStorage, re-fetch the user instead of
  // forcing a fresh login — this is what survives a page refresh.
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setLoading(false);
      return;
    }
    api.get("/me")
      .then((res) => setUser(res.data))
      .catch(() => localStorage.removeItem("token")) // token expired or invalid — clear it
      .finally(() => setLoading(false));
  }, []);

  async function login(username, password) {
    const params = new URLSearchParams();
    params.append("username", username);
    params.append("password", password);

    const res = await api.post("/login", params);
    localStorage.setItem("token", res.data.access_token);

    const me = await api.get("/me");
    setUser(me.data);
    return me.data;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
