import { useState, createContext, useContext } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // ✅ Khởi tạo trực tiếp từ localStorage
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");

  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [token, setToken] = useState(savedToken || null);
  // ✅ LOGIC KIỂM TRA QUYỀN ADMIN
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.role === "admin";


  const value = {
    user,
    token,
    login: (userData, authToken) => {
      setUser(userData);
      setToken(authToken);
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
    },
    logout: () => {
      setUser(null);
      setToken(null);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    updateUser: (updatedUser) => {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    },
    isAuthenticated,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
