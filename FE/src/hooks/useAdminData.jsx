import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api";
import { useAuth } from "./useAuth.jsx";
import { useSearch } from "./useSearch.jsx";

const AdminContext = createContext();

export const useAdminData = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user, isAdmin } = useAuth();

  const { 
    searchResults, 
    searchLoading, 
    searchError, 
    searchApprovedEvents 
  } = useSearch();

  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);
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
      const res = await api.get("/event");
      setEvents(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sự kiện:", err);
      setError(err.response?.data?.message || "Lỗi kết nối hoặc server.");
    }
  }, [isAdmin]);

  const fetchPosts = useCallback(async () => {
    if (!isAdmin) return;
    try {
      const res = await api.get("/post");
      setPosts(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách bài viết:", err);
      setError(err.response?.data?.message || "Lỗi kết nối hoặc server.");
    }
  }, [isAdmin]);

  // 🔹 Fetch tất cả khi mount
  useEffect(() => {
    if (!isAdmin) return;
    setLoading(true);
    setError(null);
    Promise.all([fetchUsers(), fetchEvents(), fetchPosts()])
      .finally(() => setLoading(false));
  }, [fetchUsers, fetchEvents, fetchPosts, isAdmin]);

  // 🔹 Toggle user status
  const toggleUserStatus = useCallback(async (userId, newStatus) => {
    try {
      await api.patch(`/user/status/${userId}`, { status: newStatus });
      setUsers(prev =>
        prev.map(u => (u.id === userId ? { ...u, status: newStatus } : u))
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái người dùng:", err);
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái người dùng.");
    }
  }, []);

  // 🔹 Change event approval status
  const changeEventApprovalStatus = useCallback(async (eventId, approvalStatus = "approved") => {
    try {
      await api.patch(`/event/approval-status/${eventId}`, { approvalStatus });
      setEvents(prev =>
        prev.map(e => (e.id === eventId ? { ...e, approvalStatus } : e))
      );
    } catch (err) {
      console.error("Lỗi khi duyệt sự kiện:", err);
      setError(err.response?.data?.message || "Không thể duyệt sự kiện.");
    }
  }, []);

  // 🔹 Delete event
  const deleteEvent = useCallback(async (eventId) => {
    try {
      await api.delete(`/event/user/${user.id}/event/${eventId}`);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error("Lỗi khi xóa sự kiện:", err);
      setError(err.response?.data?.message || "Không thể xóa sự kiện.");
    }
  }, [user.id]);

  const changePostStatus = useCallback(async (postId, newStatus) => {
    try {
      await api.patch(`/post/status/${postId}`, { status: newStatus });
      setPosts(prev =>
        prev.map(p => (p.id === postId ? { ...p, status: newStatus } : p))
      );
    } catch (err) {
      console.error("Lỗi cập nhật trạng thái bài viết:", err);
      setError(err.response?.data?.message || "Không thể cập nhật trạng thái bài viết.");
    }
  }, []);
  const deletePost = useCallback(async (postId) => {
    try {
      await api.delete(`/post/${postId}`);
      setPosts(prev => prev.filter(p => p.id !== postId));
    } catch (err) {
      console.error("Lỗi khi xóa bài viết:", err);
      setError(err.response?.data?.message || "Không thể xóa bài viết.");
    }
  }, []);
  const value = {
    users,
    events,
    posts,
    loading,
    error,
    toggleUserStatus,
    changeEventApprovalStatus,
    deleteEvent,
    changePostStatus,
    deletePost,
    // 👈 THÔNG TIN TÌM KIẾM MỚI
    searchResults,
    searchLoading,
    searchError,
    searchApprovedEvents,
  };

  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
};
