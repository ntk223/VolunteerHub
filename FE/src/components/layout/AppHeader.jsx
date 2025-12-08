import React from "react";
import {
  Layout,
  Typography,
  Space,
  Avatar,
  Button,
  Tooltip,
  Grid,
  theme, // Import theme từ antd
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  ScheduleOutlined,
  CommentOutlined,
  AreaChartOutlined,
  FileTextOutlined
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth.jsx"; // Đảm bảo đường dẫn này đúng
import { useNavigate, useLocation } from "react-router-dom";

const { Header } = Layout;
const { Title, Text } = Typography;
const { useBreakpoint } = Grid;

const AppHeader = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const screens = useBreakpoint();
  
  // Lấy các token màu sắc từ Ant Design Theme (Tự động đổi theo Dark/Light mode)
  const {
    token: { 
      colorBgContainer, 
      colorText, 
      colorBorderSecondary, 
      colorPrimary, 
      colorBgTextHover 
    },
  } = theme.useToken();

  const navItems = [
    { key: "/discuss", icon: <CommentOutlined />, label: "Thảo luận" },
    { key: "/recruitment", icon: <TeamOutlined />, label: "Tuyển thành viên" },
  ];
  if (user?.role === "admin")
    navItems.push({ key: "/admin", icon: <AreaChartOutlined />, label: "Admin" });
  if (user?.role === "manager")
    navItems.push({
      key: "/manage-events",
      icon: <ScheduleOutlined />,
      label: "Quản lý sự kiện",
    });
  if (user?.role === "volunteer") {
    navItems.push({
      key: "/manage-applications",
      icon: <FileTextOutlined style={{ fontSize: 24 }} />,
      label: <span className="menu-label">Đơn ứng tuyển</span>,
    });
  }
  return (
    <Header
      style={{
        // --- 1. VỊ TRÍ & LỚP HIỂN THỊ ---
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: 64,
        zIndex: 1000, // Đủ cao để đè lên nội dung, không cần thiết phải 2000 trừ khi có Modal đè

        // --- 2. MÀU SẮC & HẬU CẢNH (DARK MODE FRIENDLY) ---
        // Sử dụng colorBgContainer từ theme, giảm opacity xuống 0.8 để thấy hiệu ứng blur
        // Nếu muốn đặc hoàn toàn, hãy xóa dòng backgroundColor chứa colorBgContainer và dùng màu hex
        backgroundColor: colorBgContainer, 
        
        // Hiệu ứng mờ nền (kính)
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        
        // Để đảm bảo background hơi trong suốt cho hiệu ứng blur (ghi đè màu đặc bên trên nếu cần)
        // Lưu ý: Antd colorBgContainer thường là màu đặc (#ffffff hoặc #141414). 
        // Để blur hoạt động tốt nhất, ta có thể dùng rgba thủ công hoặc chấp nhận màu đặc của Antd.
        // Ở đây tôi dùng background mặc định của Antd kết hợp opacity nhẹ qua style bổ sung nếu cần, 
        // nhưng để an toàn và chống tràn chữ tốt nhất, ta giữ nền đặc hoặc bán trong suốt nhẹ:
        background: `rgba(${parseInt(colorBgContainer.slice(1, 3), 16)}, ${parseInt(colorBgContainer.slice(3, 5), 16)}, ${parseInt(colorBgContainer.slice(5, 7), 16)}, 0.85)`,

        borderBottom: `1px solid ${colorBorderSecondary}`,
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",

        // --- 3. HIỆU ỨNG ---
        transition: "all 0.3s ease",

        // --- 4. BỐ CỤC ---
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
      }}
    >
      {/* ==== BÊN TRÁI: Logo ==== */}
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {screens.md ? (
          <Title
            level={2}
            style={{
              margin: 0,
              cursor: "pointer",
              whiteSpace: "nowrap",
              color: colorPrimary, // Dùng token primary
              fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif", // Font an toàn
            }}
            onClick={() => navigate("/")}
          >
            VolunteerHub
          </Title>
        ) : (
          <div
            onClick={() => navigate("/")}
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: 20,
              color: colorPrimary,
            }}
          >
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
        {navItems.map((item) => {
          const isActive = location.pathname.includes(item.key);
          return (
            <Tooltip key={item.key} title={item.label}>
              <Button
                type="text"
                icon={item.icon}
                onClick={() => navigate(item.key)}
                style={{
                  margin: screens.md ? "0 10px" : "0 2px",
                  fontSize: 24,
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 12,
                  transition: "all 0.2s",
                  
                  // Logic màu sắc dùng Token
                  color: isActive ? colorPrimary : colorText,
                  background: isActive ? colorBgTextHover : "transparent", // colorBgTextHover là màu nền mờ khi hover của Antd
                }}
              />
            </Tooltip>
          );
        })}
      </div>

      {/* ==== BÊN PHẢI: Thông tin người dùng ==== */}
      <Space>
        <Avatar
          src={user?.avatarUrl}
          icon={<UserOutlined />}
          style={{
            backgroundColor: colorBgContainer,
            color: colorText,
            border: `1px solid ${colorBorderSecondary}`,
            cursor: "pointer"
          }}
          onClick={() => navigate("/profile")}
        />

        {screens.md && (
          <Text
            strong
            style={{
              fontSize: 15,
              cursor: "pointer",
              color: colorText, // Tự động trắng khi Dark Mode, đen khi Light Mode
            }}
            onClick={() => {
              navigate("/profile");
            }}
          >
            {user?.name || "Người dùng"}
          </Text>
        )}
      </Space>
    </Header>
  );
};

export default AppHeader;