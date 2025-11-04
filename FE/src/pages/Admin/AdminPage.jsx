// pages/Admin/AdminPage.jsx
import React from 'react';
import { Spin } from 'antd'; // Giả sử dùng Ant Design cho Spin
import { useAuth } from '../../hooks/useAuth'; // Để kiểm tra user và role
import { useAdminData } from '../../hooks/useAdminData';

const AdminPage = () => {
  const { user } = useAuth(); // Dữ liệu user đã có từ AuthProvider
  
  // 2. GỌI HOOK LẤY TẤT CẢ DATA ADMIN
  const {
    stats,
    users,
    loading
  } = useAdminData(); 

  // 1. Lớp bảo vệ UI (Mặc dù đã có AdminRoute, nhưng nên có lớp bảo vệ dữ liệu)
  if (!user || loading) return <Spin size="large" />;

  return (
    <div className="admin-page">
      <h2>👋 Trang Quản Trị Hệ Thống</h2>
      
      {/* Hiển thị thống kê */}
      <div className="admin-stats">
        <h3>Thống kê tổng quan</h3>
        <p>Tổng số người dùng: **{stats?.totalUsers || '...'}**</p>
        <p>Tổng số bài viết: **{stats?.totalPosts || '...'}**</p>
      </div>

      <hr/>

      {/* Hiển thị danh sách quản lý (ví dụ: component UserManagementTable) */}
      <div className="admin-users">
        <h3>Quản lý Người dùng</h3>
        {/* Component chuyên biệt để hiển thị và thao tác với danh sách users */}
        {/* <UserManagementTable users={users} /> */}
        <ul>
          {users.map(u => <li key={u._id}>{u.name} ({u.role})</li>)}
        </ul>
      </div>

    </div>
  );
};

export default AdminPage;