import { useState, useEffect } from 'react';
import { Timeline, Empty, Card, Typography, Spin, Tag } from 'antd';
import { TrophyOutlined, CalendarOutlined, EnvironmentOutlined } from '@ant-design/icons';
import api from '../../../api';

const { Title, Text } = Typography;

const EventCompleted = ({ userId }) => {
  const [completedEvents, setCompletedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCompletedEvents = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        // Lấy danh sách sự kiện của manager
        const response = await api.get(`/event/manager/${userId}`);
        
        // Filter các sự kiện đã hoàn thành (progressStatus === 'completed')
        const completed = response.data.filter(
          event => event.progressStatus === 'completed'
        );
        
        // Sắp xếp theo thời gian kết thúc gần nhất
        const sorted = completed.sort((a, b) => 
          new Date(b.endTime) - new Date(a.endTime)
        );
        
        setCompletedEvents(sorted);
      } catch (error) {
        console.error('Lỗi khi tải sự kiện đã hoàn thành:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCompletedEvents();
  }, [userId]);

  if (loading) {
    return (
      <Card
        title={
          <span>
            <TrophyOutlined style={{ marginRight: 8 }} />
            Sự kiện đã hoàn thành
          </span>
        }
        style={{
          borderRadius: 12,
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          height: '100%',
        }}
      >
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <Spin size="large" />
        </div>
      </Card>
    );
  }

  return (
    <Card
      title={
        <span>
          <TrophyOutlined style={{ marginRight: 8, color: '#faad14' }} />
          Sự kiện đã hoàn thành ({completedEvents.length})
        </span>
      }
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: '100%',
      }}
    >
      {completedEvents.length > 0 ? (
        <Timeline
          mode="left"
          items={completedEvents.map((event) => ({
            color: 'green',
            dot: <TrophyOutlined style={{ fontSize: '16px' }} />,
            label: (
              <Text type="secondary" style={{ fontSize: '13px' }}>
                {new Date(event.endTime).toLocaleDateString('vi-VN')}
              </Text>
            ),
            children: (
              <div>
                <Title level={5} style={{ marginBottom: 4 }}>
                  {event.title}
                </Title>
                <div style={{ marginBottom: 8 }}>
                  <Tag color="success">Hoàn thành</Tag>
                  {event.category && (
                    <Tag color="blue">{event.category.name}</Tag>
                  )}
                </div>
                <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
                  <div>
                    <CalendarOutlined style={{ marginRight: 6 }} />
                    {new Date(event.startTime).toLocaleDateString('vi-VN')} -{' '}
                    {new Date(event.endTime).toLocaleDateString('vi-VN')}
                  </div>
                  {event.location && (
                    <div style={{ marginTop: 4 }}>
                      <EnvironmentOutlined style={{ marginRight: 6 }} />
                      {event.location}
                    </div>
                  )}
                  {event.applicationsCount > 0 && (
                    <div style={{ marginTop: 4 }}>
                      👥 {event.applicationsCount} tình nguyện viên tham gia
                    </div>
                  )}
                </div>
              </div>
            ),
          }))}
        />
      ) : (
        <Empty 
          description="Chưa có sự kiện nào hoàn thành" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default EventCompleted;