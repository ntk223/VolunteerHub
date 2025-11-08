import { Layout } from "antd";
import AppHeader from "../../components/layout/AppHeader";
import Sidebar from "../../components/layout/Sidebar";
import { Outlet } from "react-router-dom";

const { Content } = Layout;

const AdminLayout = () => {
  return (
    <Layout className="main-layout admin-layout">
      <AppHeader />
      <Layout className="content-layout">
        <Sidebar />
        <Content className="main-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
