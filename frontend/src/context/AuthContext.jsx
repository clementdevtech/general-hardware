import { createContext, useContext, useEffect, useState } from "react";
import API from "../api";

const AuthContext = createContext();

function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // { id, username, email, role }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setLoading(false);
          return;
        }

        const res = await API.get("/auth/check-user", {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log("🔑 Restored user:", res.data.user);
        setUser(res.data.user);
      } catch (err) {
        console.error("❌ API Error Response:", err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, []);

  const login = async (email, password) => {
    const res = await API.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
  };

  const register = async (email, username, password) => {
    await API.post("/auth/register", { email, username, password });
  };

  const logout = async () => {
    await API.post("/auth/logout");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthProvider;
export const useAuth = () => useContext(AuthContext);
