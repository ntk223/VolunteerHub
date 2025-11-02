
import { Layout } from "antd";
import { AppHeader } from "../../components/layout/AppHeader";
import { Sidebar } from "../../components/layout/Sidebar";
import { SearchSidebar } from "../../components/layout/SearchSidebar";
import { Outlet } from "react-router-dom";
import "./Home.css";

const { Content } = Layout;

const Home = () => {
  return (
    <Layout className="main-layout">
      <AppHeader />

      <Layout className="content-layout">
        <Sidebar />

        {/* Nội dung chính */}
        <Content className="main-content">
          <Outlet />
        </Content>

        <SearchSidebar />
      </Layout>
    </Layout>
  );
};

export default Home;
