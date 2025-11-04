import { useState, useEffect } from 'react';
import axios from '../api/index'; // API instance

export const useAdminData = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        // Gọi API Admin (đã được bảo vệ)
        const [statsRes, usersRes] = await Promise.all([
          axios.get('/admin/dashboard-stats'),
          axios.get('/admin/users')
        ]);

        setStats(statsRes.data);
        setUsers(usersRes.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Admin:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  return { stats, users, loading };
};