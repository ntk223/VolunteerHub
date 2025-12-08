import { useState } from "react";
import { useTheme } from "../../hooks/useTheme";
import { Layout, Menu, Badge, Button, Popconfirm, Switch } from "antd";
import {
  HomeOutlined,
  BellOutlined,
  UserOutlined,
  PlusCircleOutlined,
  CalendarOutlined,
  LogoutOutlined,
  FileTextOutlined,
  MoonOutlined,
  SunOutlined,
  UnorderedListOutlined // Import thêm icon cho Quản lý sự kiện
} from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import CreatePostModal from "../createPost/CreatePostModal";
import CreateEventModal from "../createEvent/CreateEventModal";
import { useAuth } from "../../hooks/useAuth";
import { useSocket } from "../../hooks/useSocket";
import "../layout/Sidebar.css";

const { Sider } = Layout;

const Sidebar = ({ isMobile, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { notifications, markNotificationsAsRead } = useSocket();

  const { isDarkMode, toggleTheme } = useTheme();

  let countUnread = notifications.filter((n) => !n.isRead).length;

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  // Lấy key từ pathname, nếu là /events thì selectedKey sẽ là 'events'
  const selectedKey = location.pathname === "/" ? "home" : location.pathname.slice(1);

  const handleMenuClick = (e) => {
    if (isMobile && onClose) onClose();

    switch (e.key) {
      case "home": navigate("/"); break;
      case "events": navigate("/events"); break;
      case "notification":
        markNotificationsAsRead();
        navigate("/notification");
        break;
      case "profile": navigate("/profile"); break;
      case "create-post":
        if (!user) return navigate("/login");
        setShowCreatePost(true);
        break;
      case "create-event":
        if (!user) return navigate("/login");
        setShowCreateEvent(true);
        break;
      default: break;
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
      icon: <HomeOutlined style={{ fontSize: 20 }} />,
      label: "Trang chủ",
    },
    {
      key: "events",
      icon: <CalendarOutlined style={{ fontSize: 20 }} />,
      label: "Sự kiện",
    },
    {
      key: "create-post",
      icon: <PlusCircleOutlined style={{ fontSize: 20 }} />,
      label: "Tạo bài viết",
    },
  ];

  if (user?.role === "manager") {
    menuItems.push(
      {
        key: "create-event",
        icon: <PlusCircleOutlined style={{ fontSize: 20 }} />, // Đổi icon thành Plus để phân biệt
        label: "Tạo sự kiện",
      },
      {
        key: "manage-events",
        icon: <UnorderedListOutlined style={{ fontSize: 20 }} />, // Thêm mục Quản lý sự kiện
        label: "Quản lý sự kiện",
      }
    );
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
      icon: <BellOutlined style={{ fontSize: 20 }} />,
      label: (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
          <span>Thông báo</span>
          {countUnread > 0 && <Badge count={countUnread} offset={[0, 0]} size="small" />}
        </div>
      ),
    },
    {
      key: "profile",
      icon: <UserOutlined style={{ fontSize: 20 }} />,
      label: "Hồ sơ cá nhân",
    }
  );

  return (
    <>
      <Sider
        width={isMobile ? "100%" : 260}
        className={isMobile ? "custom-sider mobile-sider" : "desktop-sidebar left custom-sider"}
        theme="light"
        style={{
          position: isMobile ? "relative" : "sticky",
          top: isMobile ? 0 : 64,
          height: isMobile ? "100%" : "calc(100vh - 64px)",
          borderRight: isMobile ? "none" : "1px solid var(--border-color)",
          backgroundColor: "var(--sidebar-bg)",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
          
          {/* MENU CHÍNH */}
          <div style={{ flex: 1, overflowY: "auto", padding: "16px 0" }}>
            <Menu
              mode="inline"
              selectedKeys={[selectedKey]}
              onClick={handleMenuClick}
              items={menuItems}
              style={{ 
                borderRight: 0, 
                backgroundColor: "transparent",
                fontSize: "15px",
                fontWeight: 500
              }}
            />
          </div>

          {/* FOOTER */}
          <div style={{ padding: "16px 20px", borderTop: "1px solid var(--border-color)" }}>
            
            {/* Theme Toggle Switch */}
            <div style={{ 
              display: "flex", 
              justifyContent: "space-between", 
              alignItems: "center", 
              marginBottom: 16,
              color: "var(--text-color)", 
              fontWeight: 500 
            }}>
              <span>Giao diện: {isDarkMode ? "Tối" : "Sáng"}</span>
              <Switch
                checked={isDarkMode}
                onChange={toggleTheme}
                checkedChildren={<MoonOutlined />}
                unCheckedChildren={<SunOutlined />}
              />
            </div>

            {/* Logout Button */}
            <Popconfirm
              title="Đăng xuất"
              description="Bạn có chắc chắn muốn đăng xuất không?"
              onConfirm={logout}
              okText="Đồng ý"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
              placement="topRight"
            >
              <Button
                block
                size="large"
                icon={<LogoutOutlined />}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "8px",
                  border: "1px solid var(--border-color)", 
                  color: "var(--text-color)",              
                  backgroundColor: "transparent",          
                  fontWeight: 600,
                  transition: "all 0.3s"
                }}
                className="btn-logout"
              >
                Đăng xuất
              </Button>
            </Popconfirm>
          </div>
        </div>
      </Sider>

      <CreatePostModal visible={showCreatePost} onClose={() => setShowCreatePost(false)} />
      {showCreateEvent && <CreateEventModal visible={showCreateEvent} onClose={() => setShowCreateEvent(false)} />}
    </>
  );
};

export default Sidebar;