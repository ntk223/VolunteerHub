import React, { useEffect, useState, useMemo } from "react";
import {
  Table,
  Tag,
  Space,
  Button,
  Avatar,
  Spin,
  message,
  Typography,
  Input,
  Select,
} from "antd";
import { UserOutlined, SearchOutlined } from "@ant-design/icons";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";
import UnauthorizePage from "../UnauthorizePage/UnauthorizePage";

const { Text } = Typography;
const { Search } = Input;
const { Option } = Select;

export default function ManageEventPage() {
  const { user } = useAuth();
  if (!user || user.role !== "manager") return <UnauthorizePage />;

  const managerUserId = user?.id ?? user?._id ?? null;
  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(false);
  const [appsMap, setAppsMap] = useState({});
  const [searchText, setSearchText] = useState("");

  // Hàm cập nhật trạng thái tiến trình
  const updateProgressStatus = async (eventId, newStatus) => {
    try {
      await api.patch(`/event/progress-status/${eventId}`, {
        progressStatus: newStatus,
      });

      setEvents((prev) =>
        prev.map((ev) =>
          ev.id === eventId ? { ...ev, progressStatus: newStatus } : ev
        )
      );

      message.success("Cập nhật trạng thái tiến trình thành công!");
    } catch (err) {
      message.error("Chỉ có thể cập nhật tiến trình đã được duyệt.");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        let res = null;
        if (managerUserId) {
          try {
            res = await api.get(`/event/manager/${managerUserId}`);
          } catch (err) {
            console.warn("Lỗi lấy sự kiện manager, thử lấy tất cả");
          }
        }
        if (!res) res = await api.get("/event");

        let list = Array.isArray(res.data) ? res.data : [];

        list = list.map((ev) => ({
          id: ev.eventId ?? ev.id ?? ev._id,
          title: ev.title ?? ev.name ?? "Không có tiêu đề",
          startTime: ev.startTime ?? ev.start_time,
          endTime: ev.endTime ?? ev.end_time,
          location: ev.location ?? "Chưa xác định",
          approvalStatus: ev.approvalStatus ?? ev.status ?? "pending",
          progressStatus: ev.progressStatus ?? "in incomplete",
          createdAt: ev.createdAt ?? ev.created_at,
          raw: ev,
        }));

        setEvents(list);
      } catch (err) {
        message.error("Không thể tải danh sách sự kiện");
      } finally {
        setLoadingEvents(false);
      }
    };

    fetchEvents();
  }, [managerUserId]);

  const filteredAndSearchedEvents = useMemo(() => {
    let filtered = events;
    if (searchText.trim()) {
      const lowerSearch = searchText.toLowerCase();
      filtered = events.filter((event) => {
        return (
          event.title.toLowerCase().includes(lowerSearch) ||
          (event.location &&
            event.location.toLowerCase().includes(lowerSearch)) ||
          event.approvalStatus.toLowerCase().includes(lowerSearch) ||
          event.progressStatus.toLowerCase().includes(lowerSearch) ||
          (event.startTime &&
            new Date(event.startTime)
              .toLocaleString()
              .toLowerCase()
              .includes(lowerSearch)) ||
          (event.endTime &&
            new Date(event.endTime)
              .toLocaleString()
              .toLowerCase()
              .includes(lowerSearch)) ||
          (event.createdAt擋 &&
            new Date(event.createdAt)
              .toLocaleString()
              .toLowerCase()
              .includes(lowerSearch))
        );
      });
    }
    return filtered;
  }, [events, searchText]);

  const eventColumns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
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
      title: "Trạng thái duyệt",
      key: "approval",
      dataIndex: "approvalStatus",
      sorter: (a, b) => a.approvalStatus.localeCompare(b.approvalStatus),
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
    {
      title: "Tiến trình",
      dataIndex: "progressStatus",
      key: "progressStatus",
      width: 160,
      sorter: (a, b) => a.progressStatus.localeCompare(b.progressStatus),
      render: (text, record) => {
        const statusConfig = {
          incomplete: { color: "gold", label: "Chưa hoàn thành" },
          completed: { color: "green", label: "Hoàn thành" },
          cancelled: { color: "red", label: "Đã hủy" },
        };

        const current =
          statusConfig[record.progressStatus] || statusConfig.incomplete;

        return (
          <Select
            value={record.progressStatus}
            onChange={(value) => updateProgressStatus(record.id, value)}
            dropdownMatchSelectWidth={false} 
            style={{ width: "100%" }}
            dropdownRender={(menu) => <>{menu}</>}
          >
            <Option value="incomplete">
              <Tag
                color="gold"
                style={{ width: "100%", textAlign: "center", margin: 0 }}
              >
                Chưa hoàn thành
              </Tag>
            </Option>
            <Option value="completed">
              <Tag
                color="green"
                style={{ width: "100%", textAlign: "center", margin: 0 }}
              >
                Hoàn thành
              </Tag>
            </Option>
            <Option value="cancelled">
              <Tag
                color="red"
                style={{ width: "100%", textAlign: "center", margin: 0 }}
              >
                Đã hủy
              </Tag>
            </Option>
          </Select>
        );
      },
    },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      key: "createdAt",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
  ];

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
      message.error("Không thể tải danh sách ứng viên");
    }
  };

  const changeApplicationStatus = async (applicationId, newStatus, eventId) => {
    try {
      await api.patch(`/application/${applicationId}`, { status: newStatus });
      message.success("Cập nhật trạng thái ứng viên thành công");
      fetchApplicationsForEvent(eventId);
    } catch (err) {
      message.error("Không thể cập nhật trạng thái");
    }
  };

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
          return <Text type="secondary">Đã xử lý</Text>;
        }
        return (
          <Space>
            <Button
              size="small"
              type="primary"
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
    <div style={{ padding: 24 }}>
      <h2>Quản lý sự kiện</h2>

      <div style={{ marginBottom: 16, maxWidth: 500 }}>
        <Search
          placeholder="Tìm kiếm sự kiện theo tên, địa điểm, trạng thái..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={(value) => setSearchText(value)}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Table
        rowKey="id"
        dataSource={filteredAndSearchedEvents}
        columns={eventColumns}
        loading={loadingEvents}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} của ${total} sự kiện`,
        }}
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
                  <Text type="secondary"> Chưa có ứng viên nào đăng ký</Text>
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
            expanded &&
            !appsMap[record.id] &&
            fetchApplicationsForEvent(record.id),
        }}
      />
    </div>
  );
}
