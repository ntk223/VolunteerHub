// Sidebar.jsx
import { useState } from "react";
import { Layout, Menu } from "antd";
import { HomeOutlined, BellOutlined, UserOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { useNavigate, useLocation } from "react-router-dom";
import CreatePostModal from "../createPost/createPostModal"; // đảm bảo path đúng
import { useAuth } from "../../hooks/useAuth";

const { Sider } = Layout;

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const [showCreate, setShowCreate] = useState(false);

  // Lấy key hiện tại từ pathname
  const selectedKey = location.pathname === "/" ? "home" : location.pathname.slice(1);
  const handleMenuClick = (e) => {
    if (e.key === "home") navigate("/");
    if (e.key === "notification") navigate("/notification");
    if (e.key === "profile") navigate("/profile");
    if (e.key === "create-post") {
      if (!user) {
        // bạn có thể navigate tới login hoặc show message
        navigate("/login");
        return;
      }
      setShowCreate(true);
    }
  };

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
        items={[
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
          {
            key: "notification",
            icon: <BellOutlined style={{ fontSize: 24 }} />,
            label: <span className="menu-label">Notification</span>,
          },
          {
            key: "profile",
            icon: <UserOutlined style={{ fontSize: 24 }} />,
            label: <span className="menu-label">Profile</span>,
          }
        ]}
      />
    </Sider>
    
    <CreatePostModal visible={showCreate} onClose={() => setShowCreate(false)} />
    </>
  );
};
export default Sidebar;
