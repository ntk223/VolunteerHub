import { useState, useEffect } from 'react';
import api from '../api/index'; 

export const useAdminData = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        setLoading(true);
        
        const [statsRes, usersRes] = await Promise.all([
          api.get('/admin/dashboard-stats'),
          api.get('/admin/users')
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