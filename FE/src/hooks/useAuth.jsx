import { useState, createContext, useContext, useEffect } from "react";
import { apiEvents } from "../api";
import api from "../api";
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const savedUser = localStorage.getItem("user");
  const savedToken = localStorage.getItem("token");

  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);
  const [token, setToken] = useState(savedToken || null);
  
  const isAuthenticated = !!user;
  const isAdmin = isAuthenticated && user?.role === "admin";
  const logout = async () => {
    try {
      // Gọi API logout để xóa cookie trên server
      await api.post('/auth/logout', null, { withCredentials: true });
    } catch (error) {
      console.error('Logout error:', error);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
  useEffect(() => {
    apiEvents.on("unauthorized", logout);
    return () => apiEvents.off("unauthorized", logout);
  }, []);

  const value = {
    user,
    token,
    login: (userData, authToken) => {
      setUser(userData);
      setToken(authToken);
      // Vẫn lưu token vào localStorage để tương thích ngược
      // Cookie sẽ được tự động quản lý bởi browser
      localStorage.setItem("token", authToken);
      localStorage.setItem("user", JSON.stringify(userData));
    },
    logout,
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
