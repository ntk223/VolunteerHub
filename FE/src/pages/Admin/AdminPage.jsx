import { Spin, Button, Table, Tag, message } from "antd";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useAdminData } from "../../hooks/useAdminData.jsx"; // sửa import đúng
import { useEventsData } from "../../hooks/useEventsData.jsx";
import "./AdminPage.css";
import api from "../../api/index.js";

const AdminPage = () => {
  const { user, isAdmin } = useAuth();
  const {
    stats,
    users,
    events,
    loading,
    error,
    approveEvent,
    deleteEvent,
    toggleUserStatus,
  } = useAdminData();

  if (loading || !user)
    return (
      <div className="admin-loading">
        <Spin size="large" />
      </div>
    );

  if (error)
    return (
      <div className="admin-page admin-error">
        <h2>❌ Lỗi khi tải dữ liệu</h2>
        <p>{error}</p>
      </div>
    );

  if (!isAdmin)
    return (
      <div className="admin-page admin-denied">
        <h2>⛔ Quyền truy cập bị từ chối</h2>
        <p>Bạn không có quyền vào trang quản trị.</p>
      </div>
    );

  const userColumns = [
    { title: "Tên người dùng", dataIndex: "name", key: "name" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "volcano" : "blue"}>{role}</Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Bị khóa"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type={record.status === "active" ? "default" : "primary"}
          danger={record.status === "active"}
          onClick={async () => {
            try {
              await toggleUserStatus(
                record.id,
                record.status === "active" ? "blocked" : "active"
              );
              message.success(
                `Đã ${record.status === "active" ? "khóa" : "mở khóa"
                } ${record.name}`
              );
            } catch {
              message.error("Không thể cập nhật trạng thái người dùng.");
            }
          }}
        >
          {record.status === "active" ? "Khóa" : "Mở khóa"}
        </Button>
      ),
    },
  ];

  const eventColumns = [
    { title: "Tên sự kiện", dataIndex: "title", key: "title" },
    {
      title: "Người tạo",
      dataIndex: "createdBy",
      key: "createdBy",
      render: (c) => c?.name || "Không rõ",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "pending" ? "orange" : "green"}>
          {status === "pending" ? "Chờ duyệt" : "Đã duyệt"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: 8 }}>
          {record.status === "pending" && (
            <Button
              type="primary"
              onClick={async () => {
                try {
                  console.log("Duyệt sự kiện:", record.id);
                  await approveEvent(record.id);
                  message.success(`Đã duyệt "${record.title}"`);
                } catch {
                  message.error("Không thể duyệt sự kiện.");
                }
              }}
            >
              Duyệt
            </Button>
          )}
          <Button
            danger
            onClick={async () => {
              try {
                const url = `/event/user/${user.id}/event/${record.id}`;
                console.log("Calling DELETE:", url);
                await api.delete(url);

                message.success(`Đã xóa "${record.title}"`);
              } catch {
                message.error("Không thể xóa sự kiện.");
              }
            }}
          >
            Xóa
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <h2>
        👋 Xin chào, {user.name} ({isAdmin ? "Admin" : "Người dùng"})
      </h2>

      <div className="admin-stats">
        <h3>📊 Thống kê tổng quan</h3>
        <p>Tổng số người dùng: {stats?.totalUsers ?? 0}</p>
        <p>Tổng số bài viết: {stats?.totalPosts ?? 0}</p>
        <p>Tổng số sự kiện: {stats?.totalEvents ?? 0}</p>
      </div>

      <hr />

      <div className="admin-section">
        <h3>👥 Quản lý người dùng</h3>
        <Table
          dataSource={users}
          columns={userColumns}
          rowKey={(record) => record._id || record.id} // tránh warning key
          pagination={{ pageSize: 5 }}
        />
      </div>

      <div className="admin-section">
        <h3>📅 Quản lý sự kiện</h3>
        <Table
          dataSource={events}
          columns={eventColumns}
          rowKey={(record) => record._id || record.id} // tránh warning key
          pagination={{ pageSize: 5 }}
        />
      </div>
    </div>
  );
};

export default AdminPage;
