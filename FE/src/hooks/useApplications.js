import { useState, useEffect } from "react";
import api from "../api";
import { message } from "antd";

export const useApplications = (user) => {
  const [appliedEventIds, setAppliedEventIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  const fetchApplied = async () => {
    if (!user || user.role?.toLowerCase() !== "volunteer") {
      setAppliedEventIds(new Set());
      setLoading(false);
      return;
    }

    const volunteerId = user.volunteerId || user.volunteer?._id || user.volunteer?.id;
    if (!volunteerId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const res = await api.get(`/application/volunteer/${volunteerId}`);
      const validApps = (res.data || []).filter(app => !app.isCancelled);
      const eventIds = validApps.map(app => String(app.eventId));
      setAppliedEventIds(new Set(eventIds));
    } catch (err) {
      console.error("Lỗi tải danh sách ứng tuyển:", err);
      setAppliedEventIds(new Set());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplied();
  }, [user]);

  // Hàm hủy đơn ứng tuyển
  const cancelApplication = async (eventId) => {
    if (!user) return false;

    const volunteerId = user.volunteerId || user.volunteer?._id || user.volunteer?.id;
    if (!volunteerId) return false;

    try {
      // Gọi API cancel (dùng route bạn đã có: PATCH /api/application/:id/cancel)
      // Nhưng cần lấy applicationId trước → cách đơn giản nhất: tìm trong danh sách
      const res = await api.get(`/application/volunteer/${volunteerId}`);
      const app = res.data.find(a => String(a.eventId) === String(eventId) && !a.isCancelled);

      if (!app) {
        message.error("Không tìm thấy đơn ứng tuyển để hủy");
        return false;
      }

      await api.patch(`/application/${app.id}/cancel`);
      message.success("Đã hủy đơn ứng tuyển");
      fetchApplied(); // Cập nhật lại trạng thái
      return true;
    } catch (err) {
      message.error(err?.response?.data?.message || "Hủy đơn thất bại");
      return false;
    }
  };

  const refetch = () => fetchApplied();

  return {
    isApplied: (eventId) => appliedEventIds.has(String(eventId)),
    loading,
    refetch,
    cancelApplication,   
  };
};