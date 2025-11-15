import {
  Layout,
  Typography,
  Space,
  Avatar,
  Button,
  Tooltip,
  Input,
} from "antd";
import {
  TeamOutlined,
  UserOutlined,
  LogoutOutlined,
  SettingOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { useSearch } from "../../hooks/useSearch"; // Đảm bảo đường dẫn đúng

const { Header } = Layout;
const { Title, Text } = Typography;
const { Search } = Input;

const AppHeader = () => {
  const { user, logout } = useAuth() || {};
  const navigate = useNavigate();
  const location = useLocation();

  // 1. CHỈ destructuring các biến có sẵn trong useSearch
  const { setSearchQuery } = useSearch() || {};
  // const { setSearchQuery, submitSearch } = useSearch() || {}; // <-- Đã xóa submitSearch
  
  // Bạn có thể bỏ console.log này sau khi debug
  // console.log("useSearch data:", useSearch());

  // Logic 1: Cập nhật chuỗi tìm kiếm (kích hoạt debounce trong Provider)
  const handleSearchChange = (e) => {
    // Không cần trim() ở đây để user có thể nhập khoảng trắng
    const query = e.target.value; 
    setSearchQuery(query);
  };

  // Logic 2: Thực thi tìm kiếm (khi nhấn Enter/Nút)
  const handleSearchExecute = (value) => {
    const query = value.toLowerCase().trim();
    // 2a. Đảm bảo setSearchQuery đã được gọi để cập nhật trạng thái
    setSearchQuery(query); 
    
    // 2b. Chuyển hướng người dùng đến trang tìm kiếm (nơi hiển thị kết quả)
    if (location.pathname !== "/search") {
        navigate("/search");
    }
  };

  const navItems = [
    { key: "/discuss", icon: <CommentOutlined />, label: "Discuss" },
    { key: "/recruitment", icon: <TeamOutlined />, label: "Recruitment" },
    { key: "/admin", icon: <SettingOutlined />, label: "Admin" },
  ];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <Header
      // ... (style giữ nguyên)
      style={{
        position: "fixed",
        top: 0,
        width: "100%",
        zIndex: 1000,
        height: 64,
        background: "#fff",
        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        gap: 20,
      }}
    >
      {/* ==== LEFT: Logo ==== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginRight: 20,
        }}
      >
        <Title
          level={4}
          style={{ margin: 0, cursor: "pointer", color: "#1677ff" }}
          onClick={() => navigate("/")}
        >
          VolunteerHub
        </Title>
      </div>

      {/* ==== CENTER: Navigation ==== */}
      <div
        style={{
          flexGrow: 1, // chiếm toàn bộ khoảng trống giữa
          display: "flex",
          alignItems: "center",
        }}
      >
        <Space size="large">
          {navItems.map((item) => (
            <Tooltip key={item.key} title={item.label}>
              <Button
                type="text"
                icon={item.icon}
                onClick={() => navigate(item.key)}
                style={{
                  fontSize: 20,
                  color: isActive(item.key) ? "#1677ff" : "rgba(0,0,0,0.65)",
                  background: isActive(item.key)
                    ? "rgba(22,119,255,0.1)"
                    : "transparent",
                  borderRadius: 8,
                  padding: "8px 12px",
                  transition: "0.2s",
                }}
              />
            </Tooltip>
          ))}
        </Space>
      </div>

      {/* ==== RIGHT: Search + User info ==== */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 20,
        }}
      >
        {/* Search bar nằm sát bên phải */}
        <Search
          placeholder="Tìm kiếm sự kiện, người dùng, bài đăng..."
          onChange={handleSearchChange}
          onSearch={handleSearchExecute} // Giữ lại onSearch để xử lý navigate
          style={{
            width: 260,
            borderRadius: 8,
          }}
          allowClear
        />

        {/* ==== User >>> ==== */}
        <Space size="middle">
          <Button
            type="text"
            onClick={() => navigate("/profile")}
            style={{ display: "flex", alignItems: "center" }}
          >
            <Avatar
              src={user?.avatarUrl}
              icon={<UserOutlined />}
              style={{ marginRight: 8 }}
            />
            <Text style={{ color: "rgba(0,0,0,0.85)" }}>{user?.email}</Text>
          </Button>

          <Tooltip title="Đăng Xuất">
            <Button
              type="primary"
              icon={<LogoutOutlined />}
              onClick={logout}
              size="small"
            >
              Logout
            </Button>
          </Tooltip>
        </Space>
      </div>
    </Header>
  );
};

export default AppHeader;