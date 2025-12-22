import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

const DEMO_USER = {
  id: "demo-user",
  name: "Demo Developer",
  email: "demo@elearnify.dev",
  role: "student",
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  // 🔄 Persist login on reload
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Normal login
  const login = (token, userData) => {
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // 🧪 Developer demo login
  const demoLogin = () => {
    localStorage.setItem("token", "demo-token");
    localStorage.setItem("user", JSON.stringify(DEMO_USER));
    setUser(DEMO_USER);
  };

  // 🚪 Logout
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
