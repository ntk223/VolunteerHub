import { Card, Row, Col, Statistic } from 'antd';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChartOutlined } from '@ant-design/icons';
import api from '../../../api';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
const Statistics = ({ userId }) => {
  const location = useLocation();
  const [statsData, setStatsData] = useState([]);

  useEffect(() => {
    if (!userId) return;

    const fetchData = async () => {
      try {
        const response = await api.get(`/user/statistics/${userId}`);
        setStatsData([
          { name: 'Bài đăng', value: response.data[0].totalPosts },
          { name: 'Lượt thích', value: response.data[0].totalLikes },
          { name: 'Bình luận', value: response.data[0].totalComments },
          { name: 'Tương tác', value: response.data[0].totalInteractions },
        ]);
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [userId, location.pathname]); // chạy lại khi route thay đổi

  if (!statsData.length) return null;

  return (
    <Card
      title={<span><BarChartOutlined style={{ marginRight: 8 }} />Thống kê hoạt động</span>}
      style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.05)', height: '100%' }}
    >
      <Link to={`/user/posts/${userId}`}>Xem các bài viết đã đăng</Link>
      <Row gutter={[16, 16]}>
        <Col span={12}><Statistic title="Bài đăng" value={statsData[0].value || 0} /></Col>
        <Col span={12}><Statistic title="Lượt thích" value={statsData[1].value || 0} /></Col>
        <Col span={12}><Statistic title="Bình luận" value={statsData[2].value || 0} /></Col>
        <Col span={12}><Statistic title="Tương tác" value={statsData[3].value || 0} /></Col>
      </Row>

      <div style={{ height: 180, marginTop: 16 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={statsData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#FA541C" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default Statistics;
