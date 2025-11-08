import { useState, useEffect, useCallback } from "react";
import api from "../api";
import { useAuth } from "./useAuth.jsx";

export const useAdminData = () => {
  const { user, isAdmin } = useAuth();

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // 🔹 Fetch users
  const fetchUsers = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/user");
      setUsers(res.data);
    } catch (err) {
      console.error("Lỗi khi tải dữ liệu người dùng:", err);
      setError(err.response?.data?.message || "Lỗi kết nối hoặc server.");
    }
  }, [isAdmin]);

  // 🔹 Fetch events
  const fetchEvents = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/event"); // endpoint backend
      setEvents(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sự kiện:", err);
      setError(err.response?.data?.message || "Lỗi kết nối hoặc server.");
    }
  }, [isAdmin]);

  // 🔹 Fetch tất cả khi mount
  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    Promise.all([fetchUsers(), fetchEvents()])
      .finally(() => setLoading(false));
  }, [fetchUsers, fetchEvents, isAdmin]);

  // 🔹 Toggle user status
  const toggleUserStatus = useCallback(async (userId, newStatus) => {
    try {
      await api.patch(`/user/status/${userId}`, { status: newStatus });
      setUsers(prev =>
        prev.map(u => (u._id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái người dùng:", err);
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái người dùng.");
    }
  }, []);

  // 🔹 Approve event
  const approveEvent = useCallback(async (eventId, status = "approved") => {
    try {
      await api.patch(`/event/approval-status/${eventId}`, { status });
      setEvents(prev =>
        prev.map(e => (e._id === eventId ? { ...e, status } : e))
      );
    } catch (err) {
      console.error("Lỗi khi duyệt sự kiện:", err);
      setError(err.response?.data?.message || "Không thể duyệt sự kiện.");
    }
  }, []);

  // 🔹 Delete event
  const deleteEvent = useCallback(async (eventId) => {
    try {
      console.log("Xóa sự kiện thành công:", eventId);
      await api.delete(`/event/user/${user.id}/event/${eventId}`);
      setEvents(prev => prev.filter(e => e._id !== eventId));
    } catch (err) {
      console.error("Lỗi khi xóa sự kiện:", err);
      setError(err.response?.data?.message || "Không thể xóa sự kiện.");
    }
  }, []);

  return {
    users,
    events,
    loading,
    error,
    fetchUsers,
    fetchEvents,
    toggleUserStatus,
    approveEvent,
    deleteEvent,
  };
};
