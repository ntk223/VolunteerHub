import {
  Layout,
  Typography,
  Space,
  Avatar,
  Button,
  Tooltip,
  Grid, // <--- 1. Import Grid
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  ScheduleOutlined,
  CommentOutlined,
  AreaChartOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid; // <--- 2. Lấy hook useBreakpoint

const AppHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // screens sẽ trả về object dạng { xs: true, sm: true, md: false, ... }
  // screens.md = true nghĩa là chiều rộng > 768px (Tablet trở lên)
  const screens = useBreakpoint(); 

  const navItems = [
    { key: "/discuss", icon: <CommentOutlined />, label: "Discuss" },
    { key: "/recruitment", icon: <TeamOutlined />, label: "Recruitment" },
  ];
  if (user?.role === "admin")
    navItems.push({ key: "/admin", icon: <AreaChartOutlined />, label: "Admin" });
  if (user?.role === "manager")
    navItems.push({
      key: "/manage-events",
      icon: <ScheduleOutlined />,
      label: "Manage Events",
    });

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
      {/* ==== BÊN TRÁI: Logo ==== */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* LOGIC: Chỉ hiện Title khi màn hình từ md trở lên */}
        {screens.md ? (
          <Title
            level={2}
            style={{ margin: 0, cursor: "pointer", whiteSpace: "nowrap" }}
            onClick={() => navigate("/")}
          >
            VolunteerHub
          </Title>
        ) : (
          // Khi màn hình nhỏ, có thể hiện 1 icon logo nhỏ thay thế (tuỳ chọn)
          <div onClick={() => navigate("/")} style={{ cursor: "pointer", fontWeight: 'bold', fontSize: 20 }}>
             VH
          </div>
        )}
      </div>

      {/* ==== Ở GIỮA: CĂN GIỮA TUYỆT ĐỐI ==== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 16,
          position: "absolute",
          left: "50%",
          transform: "translateX(-50%)",
          height: "100%",
        }}
      >
        {navItems.map((item) => (
          <Tooltip key={item.key} title={item.label}>
            <Button
              type="text"
              icon={item.icon}
              onClick={() => navigate(item.key)}
              style={{
                margin: screens.md ? "0 10px" : "0 2px", // Thu nhỏ khoảng cách khi màn hình bé
                fontSize: 28,
                color:
                  location.pathname === item.key
                    ? "#1677ff"
                    : "rgba(0,0,0,0.65)",
                background:
                  location.pathname === item.key
                    ? "rgba(22,119,255,0.1)"
                    : "transparent",
                borderRadius: 12,
                transition: "0.2s",
                width: 55,
                height: 55,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            />
          </Tooltip>
        ))}
      </div>

      {/* ==== BÊN PHẢI: Thông tin người dùng ==== */}
      <Space>
        <Avatar src={user?.avatarUrl} icon={<UserOutlined />} />
        
        {/* LOGIC: Chỉ hiện Tên khi màn hình từ md trở lên */}
        {screens.md && (
          <Text
            style={{ fontSize: 15, cursor: "pointer" }}
            onClick={() => {
              navigate("/profile");
            }}
          >
            {user?.name}
          </Text>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;