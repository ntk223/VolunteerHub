import React, { useState } from "react";
import { Layout, Grid, Drawer } from "antd";
import AppHeader from "../../components/layout/AppHeader";
import Sidebar from "../../components/layout/Sidebar";
import SearchSidebar from "../../components/layout/SearchSidebar";
import { Outlet } from "react-router-dom";
import "./Home.css";

const { Content } = Layout;
const { useBreakpoint } = Grid;

const Home = () => {
  // 1. Kiểm tra kích thước màn hình
  const screens = useBreakpoint(); // { xs, sm, md, lg, ... }
  
  // lg = true nghĩa là màn hình lớn (Desktop) -> Hiện sidebar cố định
  // lg = false nghĩa là màn hình nhỏ -> Dùng Drawer
  const isDesktop = screens.lg; 

  // 2. State quản lý đóng mở Drawer
  const [openLeft, setOpenLeft] = useState(false);
  const [openRight, setOpenRight] = useState(false);

  return (
    <Layout className="main-layout" style={{ minHeight: "100vh" }}>
      <AppHeader />

      <Layout className="content-layout" style={{ position: "relative" }}>
        
        {/* --- SIDEBAR TRÁI --- */}
        {isDesktop ? (
          // Desktop: Hiện Sidebar tĩnh
          <div className="desktop-sidebar">
            <Sidebar />
          </div>
        ) : (
          <>
            {/* Mobile: Vùng cảm ứng mép trái */}
            <div 
              className="edge-trigger left"
              onMouseEnter={() => setOpenLeft(true)} // Desktop hover
              onClick={() => setOpenLeft(true)}      // Mobile touch
            />
            {/* Mobile: Drawer Trái */}
            <Drawer
              title="Menu"
              placement="left"
              onClose={() => setOpenLeft(false)}
              open={openLeft}
              width={250}
              bodyStyle={{ padding: 0 }} // Xóa padding để Menu đẹp hơn
            >
              <Sidebar />
            </Drawer>
          </>
        )}

        {/* --- NỘI DUNG CHÍNH --- */}
        <Content className="main-content">
          <Outlet />
        </Content>

        {/* --- SIDEBAR PHẢI --- */}
        {isDesktop ? (
          <div className="desktop-sidebar">
             <SearchSidebar />
          </div>
        ) : (
          <>
            {/* Mobile: Vùng cảm ứng mép phải */}
            <div 
              className="edge-trigger right"
              onMouseEnter={() => setOpenRight(true)}
              onClick={() => setOpenRight(true)}
            />
            {/* Mobile: Drawer Phải */}
            <Drawer
              title="Tìm kiếm"
              placement="right"
              onClose={() => setOpenRight(false)}
              open={openRight}
              width={300}
            >
              <SearchSidebar />
            </Drawer>
          </>
        )}

      </Layout>
    </Layout>
  );
};

export default Home;