import React, { useState } from "react";
import { Layout, Grid, Drawer } from "antd";
import { Outlet } from "react-router-dom";
import AppHeader from "../../components/layout/AppHeader";
import Sidebar from "../../components/layout/Sidebar";
import SearchSidebar from "../../components/layout/SearchSidebar";

// import "./Home.css"; // Nếu bạn đã có CSS trong App.css thì có thể bỏ dòng này
import "./Side.css"
const { Content } = Layout;
const { useBreakpoint } = Grid;

const Home = () => {
  // 1. Kiểm tra kích thước màn hình
  const screens = useBreakpoint(); 
  // lg = true (Desktop > 992px), lg = false (Mobile/Tablet)
  const isDesktop = screens.lg; 

  // 2. State quản lý đóng mở Drawer
  const [openLeft, setOpenLeft] = useState(false);
  const [openRight, setOpenRight] = useState(false);

  return (
    <Layout className="main-layout" style={{ minHeight: "100vh" }}>
      {/* HEADER CỐ ĐỊNH:
        AppHeader đã được set position: fixed và z-index cao ở bước trước.
      */}
      <AppHeader />

      {/* CONTENT LAYOUT:
        - marginTop: 64px -> Đẩy nội dung xuống bằng chiều cao Header để không bị che.
        - transition: Giúp hiệu ứng resize mượt mà.
      */}
      <Layout 
        className="content-layout" 
        style={{ 
          marginTop: 64, 
          minHeight: "calc(100vh - 64px)",
          transition: "all 0.2s"
        }}
      >
        
        {/* --- SIDEBAR TRÁI --- */}
        {isDesktop ? (
          // Desktop: Sidebar tự sticky (nhờ CSS trong Sidebar.jsx)
          <Sidebar />
        ) : (
          <>
            {/* Mobile: Vùng cảm ứng mép trái */}
            <div 
              className="edge-trigger left"
              onClick={() => setOpenLeft(true)}
            />
            {/* Mobile: Drawer Trái */}
            <Drawer
              title="Menu Chính"
              placement="left"
              onClose={() => setOpenLeft(false)}
              open={openLeft}
              width={280}
              styles={{ body: { padding: 0 } }} // Antd v5 syntax
              rootClassName="mobile-drawer" // Class để style thêm nếu cần
            >
              <Sidebar isMobile={true} onClose={() => setOpenLeft(false)} />
            </Drawer>
          </>
        )}

        {/* --- NỘI DUNG CHÍNH (FEED, PROFILE...) --- */}
        <Content className="main-content">
          <Outlet />
        </Content>

        {/* --- SIDEBAR PHẢI --- */}
        {isDesktop ? (
          <SearchSidebar />
        ) : (
          <>
            {/* Mobile: Vùng cảm ứng mép phải */}
            <div 
              className="edge-trigger right"
              onClick={() => setOpenRight(true)}
            />
            {/* Mobile: Drawer Phải */}
            <Drawer
              title="Tìm kiếm"
              placement="right"
              onClose={() => setOpenRight(false)}
              open={openRight}
              width={320}
              styles={{ body: { padding: 0 } }}
            >
              <SearchSidebar isMobile={true} />
            </Drawer>
          </>
        )}

      </Layout>
    </Layout>
  );
};

export default Home;