import { useState, useEffect } from 'react';
import { Timeline, Empty, Card, Typography, Spin, Tag } from 'antd';
import { ClockCircleOutlined, CalendarOutlined, EnvironmentOutlined, CheckCircleOutlined } from '@ant-design/icons';
import api from '../../../api';

const { Title, Text } = Typography;

const Activities = ({ volunteerId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      if (!volunteerId) return;
      
      try {
        setLoading(true);
        // Lấy danh sách applications của volunteer
        const response = await api.get(`/application/volunteer/${volunteerId}`);
        
        // Filter các applications đã được accepted và event đã completed
        const acceptedApps = response.data.filter(
          app => app.status === 'approved' && app.event?.progressStatus === 'completed'
        );
        
        // Sắp xếp theo thời gian kết thúc event gần nhất
        const sorted = acceptedApps.sort((a, b) => 
          new Date(b.event.endTime) - new Date(a.event.endTime)
        );
        
        setActivities(sorted);
      } catch (error) {
        console.error('Lỗi khi tải hoạt động:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();
  }, [volunteerId]);

  if (loading) {
    return (
      <Card
        title={
          <span>
            <ClockCircleOutlined style={{ marginRight: 8 }} />
            Sự kiện đã tham gia
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
          <ClockCircleOutlined style={{ marginRight: 8 }} />
          Sự kiện đã tham gia ({activities.length})
        </span>
      }
      style={{
        borderRadius: 12,
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        height: '100%',
      }}
    >
      {activities.length > 0 ? (
        <Timeline
          mode="left"
          items={activities.map((app) => {
            const event = app.event;
            return {
              color: 'blue',
              dot: <CheckCircleOutlined style={{ fontSize: '16px' }} />,
              label: (
                <Text type="secondary" style={{ fontSize: '13px' }}>
                  {event?.endTime ? new Date(event.endTime).toLocaleDateString('vi-VN') : 'N/A'}
                </Text>
              ),
              children: (
                <div>
                  <Title level={5} style={{ marginBottom: 4 }}>
                    {event?.title || 'Tên sự kiện'}
                  </Title>
                  <div style={{ marginBottom: 8 }}>
                    <Tag color="success">Đã hoàn thành</Tag>
                    {event?.category && (
                      <Tag color="blue">{event.category.name}</Tag>
                    )}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
                    {event?.startTime && event?.endTime && (
                      <div>
                        <CalendarOutlined style={{ marginRight: 6 }} />
                        {new Date(event.startTime).toLocaleDateString('vi-VN')} -{' '}
                        {new Date(event.endTime).toLocaleDateString('vi-VN')}
                      </div>
                    )}
                    {event?.location && (
                      <div style={{ marginTop: 4 }}>
                        <EnvironmentOutlined style={{ marginRight: 6 }} />
                        {event.location}
                      </div>
                    )}
                    {event?.description && (
                      <div style={{ marginTop: 4, fontStyle: 'italic' }}>
                        {event.description.length > 100 
                          ? event.description.substring(0, 100) + '...' 
                          : event.description
                        }
                      </div>
                    )}
                  </div>
                </div>
              ),
            };
          })}
        />
      ) : (
        <Empty 
          description="Chưa tham gia sự kiện nào" 
          image={Empty.PRESENTED_IMAGE_SIMPLE}
        />
      )}
    </Card>
  );
};

export default Activities;