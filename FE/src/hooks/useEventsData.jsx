import { useState, useEffect, useCallback } from "react";
import api from "../api";

export const useEventsData = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 🔹 Lấy danh sách sự kiện chờ duyệt
  const fetchEvents = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/event"); // nếu backend đúng là /event/pending
      setEvents(res.data);
    } catch (err) {
      console.error("Lỗi khi tải danh sách sự kiện:", err);
      setError(err.response?.data?.message || "Lỗi kết nối hoặc lỗi server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // 🔹 Duyệt hoặc từ chối sự kiện
  const approveEvent = useCallback(async (eventId, status) => {
    try {
      await api.patch(`/event/approval-status/${eventId}`, { status }); 
      setEvents(prev =>
        prev.map(e => (e.id === eventId ? { ...e, approvalStatus: status } : e))
      );
    } catch (err) {
      console.error("Lỗi khi duyệt sự kiện:", err);
    }
  }, []);

  // 🔹 Xóa sự kiện (nếu cần)
  const deleteEvent = useCallback(async (eventId) => {
    try {
      console.log("Xóa sự kiện:", eventId);
      await api.delete(`/api/event/${eventId}`);
      setEvents(prev => prev.filter(e => e.id !== eventId));
    } catch (err) {
      console.error("Lỗi khi xóa sự kiện:", err);
    }
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return { events, loading, error, fetchEvents, approveEvent, deleteEvent };
};
