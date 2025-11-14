// Sidebar.jsx
import { useState } from "react";
import { Layout, Menu, Badge } from "antd";
import { 
  HomeOutlined, 
  BellOutlined, 
  UserOutlined, 
  PlusCircleOutlined,
  CalendarOutlined // icon cho create event
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
  const { user } = useAuth();
  const { notifications, markNotificationsAsRead } = useSocket();

  let countUnread = notifications.filter(n => !n.isRead).length;

  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showCreateEvent, setShowCreateEvent] = useState(false);

  const selectedKey = location.pathname === "/" 
    ? "home" 
    : location.pathname.slice(1);

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
  };

  // Danh sách items của Menu
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

  // ➕ Thêm mục Create Event nếu user là manager
  if (user?.role === "manager") {
    menuItems.push({
      key: "create-event",
      icon: <CalendarOutlined style={{ fontSize: 24 }} />,
      label: <span className="menu-label">Create Event</span>,
    });
  }

  menuItems.push(
    {
      key: "notification",
      icon: <BellOutlined style={{ fontSize: 24 }} />,
      label: (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
          paddingTop: 16,
          height: "calc(100vh - 64px)",
          position: "sticky",
          top: 64,
          alignSelf: "flex-start",
        }}
      >
        <Menu
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={handleMenuClick}
          style={{ borderRight: 0 }}
          items={menuItems}
        />
      </Sider>

      {/* Modal Create Post */}
      <CreatePostModal 
        visible={showCreatePost} 
        onClose={() => setShowCreatePost(false)} 
      />

      {/* Modal Create Event */}
      {<CreateEventModal 
        visible={showCreateEvent}
        onClose={() => setShowCreateEvent(false)}
      />}
    </>
  );
};

export default Sidebar;
