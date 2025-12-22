import { createContext, useContext, useEffect, useState } from "react";

// ✅ 1. Give a default value (null is OK, but explicit is better)
const AuthContext = createContext(null);

const DEMO_USER = {
  id: "demo-user",
  name: "Demo Developer",
  email: "demo@elearnify.dev",
  role: "student",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ prevents early access

  useEffect(() => {
    const u = localStorage.getItem("user");
    const t = localStorage.getItem("token");

    if (u && t) {
      try {
        setUser(JSON.parse(u));
        setToken(t);
      } catch (err) {
        console.error("Invalid user in localStorage");
        localStorage.clear();
      }
    }
    setLoading(false); // ✅ done loading
  }, []);

  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setToken(token);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ✅ 2. SAFE hook (prevents your crash)
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === null) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }

  return context;
};
