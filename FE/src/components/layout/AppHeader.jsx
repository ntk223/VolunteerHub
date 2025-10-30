import { Layout, Typography, Space, Avatar, Button } from "antd";
import { UserOutlined, LogoutOutlined } from "@ant-design/icons";

const { Header } = Layout;
const { Title, Text } = Typography;

export const AppHeader = ({ user, onLogout }) => {
  return (
    <Header
      style={{
        background: "#fff",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 24px",
        borderBottom: "1px solid #cfc6c6ff",
      }}
    >
      <Title level={4} style={{ margin: 0 }}>
        VolunteerHub
      </Title>
      <Space>
        <Avatar icon={<UserOutlined />} />
        <Text>{user?.email}</Text>
        <Button type="primary" icon={<LogoutOutlined />} onClick={onLogout}>
          Logout
        </Button>
      </Space>
    </Header>
  );
};