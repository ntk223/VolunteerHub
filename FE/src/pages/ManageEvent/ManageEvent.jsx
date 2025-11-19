import React, { useEffect, useState } from "react";
import { Table, Tag, message, Typography } from "antd";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { Text } = Typography;

export default function ManageEventPage() {
  const { user } = useAuth();

  if (!user || user.role !== "manager") {
    return null;
  }

  const managerUserId = user?.id ?? user?._id ?? null;
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        let res = null;

        if (managerUserId) {
          try {
            res = await api.get(`/event/manager/${encodeURIComponent(managerUserId)}`);
          } catch (err) {
            console.warn("GET /event/manager/:userId failed, fallback /event", err);
          }
        }

        if (!res) {
          res = await api.get("/event");
        }

        let list = Array.isArray(res.data) ? res.data : [];
        list = list.map((ev) => ({
          id: ev.id ?? ev.eventId ?? ev._id,
          title: ev.title ?? ev.name,
          startTime: ev.startTime ?? ev.start_time,
          endTime: ev.endTime ?? ev.end_time,
          location: ev.location,
          approvalStatus: ev.approvalStatus ?? ev.approval_status,
          progressStatus: ev.progressStatus ?? ev.progress_status,
          createdAt: ev.createdAt ?? ev.created_at,
          raw: ev,
        }));

        if (!res.config?.url?.includes(`/event/manager/${encodeURIComponent(managerUserId)}`) && managerUserId) {
          list = list.filter((e) => {
            const m =
              e.raw?.managerId ??
              e.raw?.manager_id ??
              e.raw?.manager?.id ??
              e.raw?.createdBy ??
              e.raw?.creatorId ??
              e.raw?.userId ??
              e.raw?.user_id;
            return m == null ? false : String(m) === String(managerUserId);
          });
        }

        setEvents(list);
      } catch (err) {
        console.error("fetch events error", err);
        message.error("Không thể tải danh sách sự kiện");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [managerUserId]);

  const columns = [
    { title: "Tên sự kiện", dataIndex: "title", key: "title", render: (t) => <Text strong>{t}</Text> },
    {
      title: "Thời gian",
      key: "time",
      render: (_, row) => {
        const s = row.startTime ? new Date(row.startTime).toLocaleString() : "-";
        const e = row.endTime ? new Date(row.endTime).toLocaleString() : "-";
        return <div>{s} — {e}</div>;
      },
    },
    { title: "Địa điểm", dataIndex: "location", key: "location" },
    {
      title: "Trạng thái",
      key: "approval",
      render: (_, row) => (
        <Tag color={row.approvalStatus === "approved" ? "green" : row.approvalStatus === "pending" ? "orange" : "red"}>
          {row.approvalStatus}
        </Tag>
      ),
    },
    { title: "Tiến trình", dataIndex: "progressStatus", key: "progressStatus" },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Sự kiện của tôi</h2>

      <Table
        rowKey="id"
        dataSource={events}
        columns={columns}
        loading={loadingEvents}
      />
    </div>
  );
}
