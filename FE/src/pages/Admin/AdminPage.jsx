import { Tabs, Spin, Card, Typography } from "antd";
import { 
  DashboardOutlined, 
  UserOutlined, 
  FileTextOutlined, 
  CalendarOutlined 
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useAdminData } from "../../hooks/useAdminData.jsx";
import UserManage from "../../components/admin/UserManage.jsx";
import PostManage from "../../components/admin/PostManage.jsx";
import EventManage from "../../components/admin/EventManage.jsx";
import DashboardStatistic from "../../components/admin/DashboardStatistic.jsx";
import UnauthorizePage from "../UnauthorizePage/UnauthorizePage.jsx";
import "./AdminPage.css";

const { Title } = Typography;

const AdminPage = () => {
  const { user, isAdmin } = useAuth();

  // 3. Render giao diện từ chối
  if (!isAdmin) {
    return <UnauthorizePage />;
  }
  const {
    users,
    posts,
    events,
    loading,
    error,
    changeEventApprovalStatus,
    deleteEvent,
    toggleUserStatus,
    changePostStatus,
    deletePost,
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



  return (
    <div className="admin-page">
      <Card 
        bordered={false}
        style={{ 
          borderRadius: 12, 
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
          marginBottom: 24
        }}
      >
        <div style={{ marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0, marginBottom: 8 }}>
            Quản trị hệ thống
          </Title>
          <Typography.Text type="secondary">
            Quản lý người dùng, bài viết, sự kiện và xem thống kê hệ thống
          </Typography.Text>
        </div>

        <Tabs
          defaultActiveKey="statistics"
          size="large"
          items={[
            {
              key: "statistics",
              label: (
                <span>
                  <DashboardOutlined /> Thống kê
                </span>
              ),
              children: (
                <DashboardStatistic
                  users={users}
                  posts={posts}
                  events={events}
                />
              )
            },
            {
              key: "users",
              label: (
                <span>
                  <UserOutlined /> Quản lý người dùng
                </span>
              ),
              children: (
                <UserManage
                  users={users}
                  toggleUserStatus={toggleUserStatus}
                />
              ),
            },
            {
              key: "posts",
              label: (
                <span>
                  <FileTextOutlined /> Quản lý bài viết
                </span>
              ),
              children: <PostManage posts={posts} changePostStatus={changePostStatus} deletePost={deletePost} />,
            },
            {
              key: "events",
              label: (
                <span>
                  <CalendarOutlined /> Quản lý sự kiện
                </span>
              ),
              children: (
                <EventManage
                  events={events}
                  changeEventApprovalStatus={changeEventApprovalStatus}
                  deleteEvent={deleteEvent}
                  user={user}
                />
              ),
            },
          ]}
        />
      </Card>
    </div>
  );
};

export default AdminPage;
