import {
  Layout,
  Typography,
  Space,
  Avatar,
  Button,
  Tooltip,
} from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;
const { Title, Text } = Typography;

const AppHeader = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Các mục điều hướng ở giữa header
  const navItems = [
    { key: "/discuss", icon: <CommentOutlined />, label: "Discuss" },
    { key: "/recruitment", icon: <TeamOutlined />, label: "Recruitment" },
    { key: "/admin", icon: <SettingOutlined />, label: "Admin" },
  ];

  return (
    <Header
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        height: 64,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      {/* ==== BÊN TRÁI: Logo==== */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <Title
          level={4}
          style={{ margin: 0, cursor: "pointer" }}
          onClick={() => navigate("/")}
        >
          VolunteerHub
        </Title>
      </div>

      {/* ==== Ở GIỮA: Nút điều hướng ==== */}
      <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
        {navItems.map((item) => (
          <Tooltip key={item.key} title={item.label}>
            <Button
              type="text"
              icon={item.icon}
              onClick={() => navigate(item.key)}
              style={{
                fontSize: 20,
                color:
                  location.pathname === item.key ? "#1677ff" : "rgba(0,0,0,0.65)",
                background:
                  location.pathname === item.key ? "rgba(22,119,255,0.1)" : "transparent",
                borderRadius: 8,
                transition: "0.2s",
              }}
            />
          </Tooltip>
        ))}
      </div>

      {/* ==== BÊN PHẢI: Thông tin người dùng ==== */}
      <Space>
        <Avatar src={user?.avatarUrl} icon={<UserOutlined />} />
        <Text style={{ fontSize: 14 }}>{user?.email}</Text>
        <Button
          type="primary"
          icon={<LogoutOutlined />}
          onClick={logout}
          size="small"
        >
          Logout
        </Button>
      </Space>
    </Header>
  );
};

export default AppHeader;
