import { Layout, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const { Sider } = Layout;

const SearchSidebar = () => {
  return (
    <Sider
      width={450}
      style={{
        background: "#fff",
        borderLeft: "1px solid #cfc6c6ff",
        padding: "16px",
        height: "calc(100vh - 64px)",
        position: "sticky",
        top: 64,
        alignSelf: "flex-start",
      }}
    >
      <Input
        placeholder="Search..."
        prefix={<SearchOutlined />}
        allowClear
        style={{ borderRadius: 8 }}
      />
    </Sider>
  );
};
export default SearchSidebar;
