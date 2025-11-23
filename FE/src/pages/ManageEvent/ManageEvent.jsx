import React, { useEffect, useState } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Avatar,
  Spin,
  message,
  Typography,
} from "antd";
import { UserOutlined } from "@ant-design/icons";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { Text } = Typography;

export default function ManageEventPage() {
  const { user } = useAuth();
  if (!user || user.role !== "manager") return null;

  const managerUserId = user?.id ?? user?._id ?? null;
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);

  const [appsMap, setAppsMap] = useState({});

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        let res = null;
        if (managerUserId) {
          try {
            res = await api.get(`/event/manager/${managerUserId}`);
          } catch (err) {
            message.error("Không thể tải danh sách sự kiện", err?.response?.data?.message || "");
          }
        }
        if (!res) res = await api.get("/event");

        let list = Array.isArray(res.data) ? res.data : [];

        list = list.map((ev) => ({
          id: ev.eventId ?? ev.id ?? ev._id,
          title: ev.title ?? ev.name,
          startTime: ev.startTime ?? ev.start_time,
          endTime: ev.endTime ?? ev.end_time,
          location: ev.location,
          approvalStatus: ev.approvalStatus ?? ev.status,
          progressStatus: ev.progressStatus,
          createdAt: ev.createdAt,
          raw: ev,
        }));

        setEvents(list);
      } catch (err) {
        message.error("Không thể tải danh sách sự kiện", err?.response?.data?.message || "");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [managerUserId]);

  const fetchApplicationsForEvent = async (eventId) => {
    setAppsMap((m) => ({ ...m, [eventId]: { loading: true, list: [] } }));
    try {
      const res = await api.get(`/application/event/${eventId}`);
      const list = Array.isArray(res.data)
        ? res.data
        : Array.isArray(res.data.applications)
        ? res.data.applications
        : [];

      const enriched = list.map((app) => {
        const volunteer = app.volunteer ?? app.Volunteer ?? null;
        const volunteerUser =
          volunteer?.user ?? volunteer?.User ?? app.user ?? null;

        // Lấy tên
        const name =
          volunteerUser?.name ||
          volunteerUser?.fullName ||
          volunteer?.fullName ||
          volunteer?.name ||
          `Volunteer #${app.volunteerId}`;

        const email = volunteerUser?.email || volunteer?.email || null;

        const avatar =
          volunteerUser?.avatarUrl ||
          volunteerUser?.avatar ||
          volunteer?.avatar ||
          null;

        return {
          id: app.id ?? app.applicationId,
          eventId: app.eventId,
          volunteerId: app.volunteerId,
          status: app.status,
          appliedAt: app.appliedAt ?? app.applied_at,

          user: { name, email, avatarUrl: avatar },
          raw: app,
        };
      });

      setAppsMap((m) => ({
        ...m,
        [eventId]: { loading: false, list: enriched },
      }));
    } catch (err) {
      setAppsMap((m) => ({ ...m, [eventId]: { loading: false, list: [] } }));
      message.error("Không thể tải danh sách ứng viên", err?.response?.data?.message || "");
    }
  };

  const changeApplicationStatus = async (applicationId, newStatus, eventId) => {
    try {
      await api.patch(`/application/${applicationId}`, { status: newStatus });
      message.success("Cập nhật trạng thái thành công");
      fetchApplicationsForEvent(eventId);
    } catch (err) {
      message.error("Không thể cập nhật trạng thái", err?.response?.data?.message || "");
    }
  };

  const eventColumns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, row) => {
        const s = row.startTime
          ? new Date(row.startTime).toLocaleString()
          : "-";
        const e = row.endTime ? new Date(row.endTime).toLocaleString() : "-";
        return (
          <div>
            {s} — {e}
          </div>
        );
      },
    },
    { title: "Địa điểm", dataIndex: "location", key: "location" },
    {
      title: "Trạng thái",
      key: "approval",
      render: (_, row) => (
        <Tag
          color={
            row.approvalStatus === "approved"
              ? "green"
              : row.approvalStatus === "pending"
              ? "orange"
              : "red"
          }
        >
          {row.approvalStatus}
        </Tag>
      ),
    },
    { title: "Tiến trình", dataIndex: "progressStatus", key: "progressStatus" },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
  ];

  const applicantColumns = (eventId) => [
    {
      title: "Ứng viên",
      key: "applicant",
      render: (_, r) => {
        const u = r.user;
        return (
          <Space>
            <Avatar size="small" src={u?.avatarUrl} icon={<UserOutlined />} />
            <div>
              <div>{u?.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{u?.email}</div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Thời gian ứng tuyển",
      dataIndex: "appliedAt",
      key: "appliedAt",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => <Tag color="blue">{s}</Tag>,
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => {
        if (r.status !== "pending") {
          return <Text type="secondary"> Đã xử lý</Text>;
        }

        return (
          <Space>
            <Button
              size="small"
              onClick={() => changeApplicationStatus(r.id, "approved", eventId)}
            >
              Duyệt
            </Button>
            <Button
              size="small"
              danger
              onClick={() => changeApplicationStatus(r.id, "rejected", eventId)}
            >
              Từ chối
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 16 }}>
      <h2>Sự kiện của tôi</h2>

      <Table
        rowKey="id"
        dataSource={events}
        columns={eventColumns}
        loading={loadingEvents}
        expandable={{
          expandedRowRender: (record) => {
            const eventId = record.id;
            const state = appsMap[eventId] ?? { loading: false, list: [] };

            return (
              <div style={{ padding: 12 }}>
                <Button
                  onClick={() => fetchApplicationsForEvent(eventId)}
                  style={{ marginBottom: 12 }}
                >
                  Tải lại danh sách ứng viên
                </Button>

                {state.loading ? (
                  <Spin />
                ) : state.list.length === 0 ? (
                  <Text type="secondary"> Chưa có ứng viên</Text>
                ) : (
                  <Table
                    rowKey="id"
                    pagination={false}
                    dataSource={state.list}
                    columns={applicantColumns(eventId)}
                  />
                )}
              </div>
            );
          },
          onExpand: (expanded, record) =>
            expanded && fetchApplicationsForEvent(record.id),
        }}
      />
    </div>
  );
}
