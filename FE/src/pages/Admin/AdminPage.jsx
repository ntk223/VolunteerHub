import { Tabs, Spin, Button } from "antd";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useAdminData } from "../../hooks/useAdminData.jsx";
import UserManage from "../../components/admin/UserManage.jsx";
import PostManage from "../../components/admin/PostManage.jsx";
import EventManage from "../../components/admin/EventManage.jsx";
import DashboardStatistic from "../../components/admin/DashboardStatistic.jsx";
import UnauthorizePage from "../UnauthorizePage/UnauthorizePage.jsx";
import "./AdminPage.css";

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


      <Tabs
        defaultActiveKey="statistics"

        items={[
          {
            key: "statistics",
            label: "📈 Thống kê",
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
            label: "👥 Quản lý người dùng",
            children: (
              <UserManage
                users={users}
                toggleUserStatus={toggleUserStatus}
              />
            ),
          },
          {
            key: "posts",
            label: "📝 Quản lý bài viết",
            children: <PostManage posts={posts} changePostStatus={changePostStatus} deletePost={deletePost} />,
          },
          {
            key: "events",
            label: "📅 Quản lý sự kiện",
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
    </div>
  );
};

export default AdminPage;
