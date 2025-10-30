import { Layout, Menu } from "antd";
import { HomeOutlined, BellOutlined } from "@ant-design/icons";

const { Sider } = Layout;

export const Sidebar = ({ selectedKey, onMenuClick }) => {
  return (
    <Sider
      className="home-sider"
      width={450}
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
        onClick={onMenuClick}
        style={{ borderRight: 0 }}
        items={[
          {
            key: "home",
            icon: <HomeOutlined style={{ fontSize: 24 }} />,
            label: <span className="menu-label">Home</span>,
          },
          {
            key: "notification",
            icon: <BellOutlined style={{ fontSize: 24 }} />,
            label: <span className="menu-label">Notification</span>,
          },
        ]}
      />
    </Sider>
  );
};