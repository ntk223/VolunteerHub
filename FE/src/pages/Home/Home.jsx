import React from 'react';
import { Layout } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Sidebar from "../../components/layout/Sidebar";
import { SearchProvider } from "../../hooks/useSearch";

const { Content } = Layout;

const Home = () => {
  return (
    <SearchProvider>
      <Layout style={{ minHeight: "100vh", background: "#f5f5f5" }}>

        {/* HEADER CỐ ĐỊNH */}
        <AppHeader />

        {/* PHẦN DƯỚI HEADER */}
        <Layout style={{ marginTop: 64 }}> {/* để tránh bị header đè lên */}
          
          {/* SIDEBAR BÊN TRÁI */}
          <Sidebar />

          {/* NỘI DUNG CHÍNH */}
          <Content
            style={{
              padding: "24px",
              background: "#f5f5f5",
              overflowY: "auto",
              height: "calc(100vh - 64px)"
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </SearchProvider>
  );
};

export default Home;
