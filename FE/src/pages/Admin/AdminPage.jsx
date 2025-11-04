import React from 'react';
import { Spin } from 'antd'; 
import { useAuth } from '../../hooks/useAuth'; 
import { useAdminData } from '../../hooks/useAdminData';

const AdminPage = () => {
  const { user } = useAuth(); 
  
  // 2. GỌI HOOK LẤY TẤT CẢ DATA ADMIN
  const {
    stats,
    users,
    loading
  } = useAdminData(); 

  
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

      {/* Hiển thị danh sách quản lý */}
      <div className="admin-users">
        <h3>Quản lý Người dùng</h3>
        <ul>
          {users.map(u => <li key={u._id}>{u.name} ({u.role})</li>)}
        </ul>
      </div>

    </div>
  );
};

export default AdminPage;