import { createContext, useContext, useState, useEffect } from "react";
import api from "../api";
import { useAuth } from "./useAuth";

const AdminContext = createContext(null);

export const AdminProvider = ({ children }) => {
  const { isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Lấy danh sách người dùng
  useEffect(() => {
    if (!isAdmin) {
      setLoading(false);
      setError("Bạn không có quyền truy cập dữ liệu Admin.");
      return;
    }

    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/user"); // chú ý không dư /api
        setUsers(res.data);
      } catch (err) {
        console.error("Lỗi khi tải danh sách người dùng:", err);
        setError(err.response?.data?.message || "Lỗi kết nối hoặc lỗi server.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [isAdmin]);

  // 🔹 Khóa / mở tài khoản người dùng
  const toggleUserStatus = async (userId, newStatus) => {
    try {
      await api.put(`/user/status/${userId}`, { status: newStatus });
      setUsers((prev) =>
        prev.map((u) => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái người dùng:", err);
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái người dùng.");
    }
  };

  return (
    <AdminContext.Provider value={{ users, loading, error, toggleUserStatus }}>
      {children}
    </AdminContext.Provider>
  );
};

// Hook để sử dụng dữ liệu Admin
export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error("useAdmin() phải được dùng bên trong <AdminProvider>");
  }
  return context;
};
