import React, { useEffect, useState } from "react";
import { Table, Tag, Space, Button, message, Typography, Spin } from "antd";
import { useAuth } from "../../hooks/useAuth";
import api from "../../api";

const { Text } = Typography;

export default function ManageApplicationsPage() {
  const { user } = useAuth();
  console.log("Current user:", user);
  if (!user || user.role !== "volunteer") return <div>Access denied</div>;

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        // strictly use volunteerId (not userId)
        const volunteerId = user.volunteerId ?? user.volunteer.id;
        if (!volunteerId) {
          message.error("Không tìm thấy volunteer ID");
          setApplications([]);
          return;
        }

        // use the route that exists: GET /application/volunteer/:volunteerId
        const res = await api.get(`/application/volunteer/${encodeURIComponent(volunteerId)}`);

        const list = Array.isArray(res.data) ? res.data : res.data.applications || [];
        const enriched = list
          .filter((app) => {
            // hide if is_cancelled is 1 or status is 'cancelled'
            const isCancelled = app.isCancelled === 1 || app.isCancelled === true || (app.status ?? "").toLowerCase() === "cancelled";
            return !isCancelled;
          })
          .map((app) => ({
            id: app.id ?? app.applicationId ?? app._id,
            eventId: app.eventId ?? app.event_id,
            event: app.event ?? null, // assume backend populated event
            status: app.status ?? app.state ?? "pending",
            appliedAt: app.appliedAt ?? app.applied_at,
            raw: app,
          }));

        setApplications(enriched);
      } catch (err) {
        console.error("fetch applications error", err);
        message.error("Không thể tải danh sách ứng tuyển");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [user]);

  const handleCancel = async (applicationId) => {
  try {
    await api.patch(`/application/${applicationId}/cancel`);
    message.success("Đã hủy ứng tuyển thành công");

    setLoading(true);
    const volunteerId = user.volunteerId ?? user.volunteer.id;
    const res = await api.get(`/application/volunteer/${volunteerId}`);
    
    const list = Array.isArray(res.data) ? res.data : res.data.applications || [];
    const enriched = list
      .filter((app) => {
        const isCancelled = app.isCancelled === true || app.isCancelled === 1;
        return !isCancelled;
      })
      .map((app) => ({
        id: app.id,
        eventId: app.eventId,
        event: app.event,
        status: app.status ?? "pending",
        appliedAt: app.createdAt || app.appliedAt,
        raw: app,
      }));

    setApplications(enriched);
    setLoading(false);

  } catch (err) {
    console.error("cancel error", err);
    message.error("Hủy ứng tuyển thất bại");
  }
};

  const columns = [
    {
      title: "Sự kiện",
      render: (_, r) => {
        const ev = r.event;
        return ev ? (
          <div>
            <Text strong>{ev.title ?? ev.name ?? "Unknown"}</Text>
            <br />
            <Text type="secondary">{ev.location ?? ""}</Text>
          </div>
        ) : (
          <Text>Event ID: {r.eventId}</Text>
        );
      },
    },
    {
      title: "Thời gian ứng tuyển",
      dataIndex: "appliedAt",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => <Tag color={s === "accepted" ? "green" : s === "rejected" ? "red" : s === "cancelled" ? "orange" : "blue"}>{s}</Tag>,
    },
    {
      title: "Hành động",
      render: (_, r) => {
        const status = (r.status ?? "").toLowerCase();
        if (status === "cancelled" || status === "rejected" || status === "attended") {
          return null;
        }
        return (
          <Button size="small" danger onClick={() => handleCancel(r.id)}>
            Hủy ứng tuyển
          </Button>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Ứng tuyển của tôi</h2>
      <Table
        rowKey="id"
        dataSource={applications}
        columns={columns}
        loading={loading}
        pagination={false}
      />
    </div>
  );
}