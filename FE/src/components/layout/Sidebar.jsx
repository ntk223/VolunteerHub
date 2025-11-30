// Sidebar.jsx
import { useState } from "react";
import { Layout, Menu, Badge, Button, Popconfirm } from "antd";
import {
  HomeOutlined,
  BellOutlined,
  UserOutlined,
  PlusCircleOutlined,
  CalendarOutlined,
  LogoutOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import CreatePostModal from "../createPost/CreatePostModal";
import CreateEventModal from "../createEvent/CreateEventModal";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications, markNotificationsAsRead } = useSocket();

  let countUnread = notifications.filter((n) => !n.isRead).length;

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const selectedKey =
    location.pathname === "/" ? "home" : location.pathname.slice(1);

  const handleMenuClick = (e) => {
    if (e.key === "home") navigate("/");
    if (e.key === "notification") {
      markNotificationsAsRead();
      navigate("/notification");
    }
    if (e.key === "profile") navigate("/profile");
    if (e.key === "create-post") {
      if (!user) return navigate("/login");
      setShowCreatePost(true);
    }
    if (e.key === "create-event") {
      if (!user) return navigate("/login");
      setShowCreateEvent(true);
    }
    if (e.key === "manage-events") {
      if (!user) return navigate("/login");
      navigate("/manage-events");
    }
    if (e.key === "manage-applications") {
      if (!user) return navigate("/login");
      navigate("/manage-applications");
    }
  };

  const menuItems = [
    {
      key: "home",
      icon: <HomeOutlined style={{ fontSize: 24 }} />,
      label: <span className="menu-label">Home</span>,
    },
    {
      key: "create-post",
      icon: <PlusCircleOutlined style={{ fontSize: 24 }} />,
      label: <span className="menu-label">Create Post</span>,
    },
  ];

  if (user?.role === "manager") {
    menuItems.push({
      key: "create-event",
      icon: <CalendarOutlined style={{ fontSize: 24 }} />,
      label: <span className="menu-label">Create Event</span>,
    });
  }

  if (user?.role === "volunteer") {
    menuItems.push({
      key: "manage-applications",
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
      label: <span className="menu-label">My Applications</span>,
    });
  }

  menuItems.push(
    {
      key: "notification",
      icon: <BellOutlined style={{ fontSize: 24 }} />,
      label: (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span className="menu-label">Notification</span>
          {countUnread > 0 && <Badge count={countUnread} size="small" />}
        </div>
      ),
    },
    {
      key: "profile",
      icon: <UserOutlined style={{ fontSize: 24 }} />,
      label: <span className="menu-label">Profile</span>,
    }
  );

  return (
    <>
      <Sider
        className="home-sider"
        width={250}
        style={{
          background: "#fff",
          borderRight: "1px solid #cfc6c6ff",
          height: "calc(100vh - 64px)",
          position: "sticky",
          top: 64,
          alignSelf: "flex-start",
        }}
      >
        {/* --- TẠO MỘT DIV WRAPPER VỚI CHIỀU CAO 100% --- */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%", // Quan trọng: Chiếm trọn chiều cao của Sider
          }}
        >
          {/* Phần Menu: flex: 1 để đẩy các phần tử khác xuống */}
          <div style={{ flex: 1, overflowY: "auto", paddingTop: 16 }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleMenuClick}
              style={{ borderRight: 0 }}
              items={menuItems}
            />
          </div>
          <div style={{ padding: "16px", borderTop: "1px solid #f0f0f0" }}>
            <Popconfirm
              title="Đăng xuất"
              description="Bạn có chắc chắn muốn đăng xuất không?"
              onConfirm={logout} // Hàm logout chỉ chạy khi bấm "Đồng ý"
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }} // Nút Đồng ý màu đỏ
            >
              <Button
                type="primary"
                block
                size="middle"
                icon={<LogoutOutlined />}
                style={{
                  backgroundColor: "#16aefaff", // Màu cam
                  borderColor: "#16aefaff",
                  color: "white",
                }}
              >
                Logout
              </Button>
            </Popconfirm>
          </div>
        </div>
      </Sider>

      {/* Modal Create Post */}
      <CreatePostModal
        visible={showCreatePost}
        onClose={() => setShowCreatePost(false)}
      />

      {/* Modal Create Event */}
      {
        <CreateEventModal
          visible={showCreateEvent}
          onClose={() => setShowCreateEvent(false)}
        />
      }
    </>
  );
};

export default Sidebar;
