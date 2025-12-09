import React from 'react';
import { Card, Tag, Button, Space } from 'antd';
import {
  CalendarOutlined,
  EnvironmentOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event, isJoined, onCardClick }) => {
  const navigate = useNavigate();

  // Format ngày giờ hiển thị
  const dateStr = new Date(event.date || event.startTime).toLocaleDateString('vi-VN');
  const timeStr = event.startTime
    ? new Date(event.startTime).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })
    : '';

  const getStatusTag = (status) => {
    const statusConfig = {
      incomplete: { color: 'yellow', text: 'Đang mở đăng ký' },
      completed: { color: 'green', text: 'Đã hoàn thành' },
      cancelled: { color: 'red', text: 'Đã hủy' },
    };
    const config = statusConfig[status] || statusConfig.incomplete;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  return (
    <Card
      hoverable
      style={{ borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
      bodyStyle={{ padding: 16, flex: 1 }}
      cover={
        <div
          style={{ height: 180, overflow: 'hidden', position: 'relative' }}
          onMouseEnter={(e) => {
            const overlay = e.currentTarget.querySelector('.hover-overlay');
            if (overlay) overlay.style.opacity = '1';
          }}
          onMouseLeave={(e) => {
            const overlay = e.currentTarget.querySelector('.hover-overlay');
            if (overlay) overlay.style.opacity = '0';
          }}
        >
          <img
            alt={event.title}
            src={event.imgUrl}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
            onError={(e) => {
              e.target.src = 'https://via.placeholder.com/300x180?text=No+Image';
            }}
          />
          
          {/* Status Tag */}
          <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
            {getStatusTag(event.progressStatus)}
          </div>

          {/* Hot Badge */}
          {event.postsCount >= 10 && (
            <div style={{ position: 'absolute', top: 10, left: 10, zIndex: 2 }}>
              <Tag color="red" style={{ fontWeight: 'bold' }}>
                🔥 HOT
              </Tag>
            </div>
          )}

          {/* Hover Overlay */}
          <div
            className="hover-overlay"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
              color: '#fff',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              opacity: 0,
              transition: 'opacity 0.3s ease-in-out',
              padding: '10px',
              textAlign: 'center',
              zIndex: 1,
            }}
          >
            <Space direction="vertical" size={8}>
              <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                <EnvironmentOutlined /> {event.location}
              </div>
              <div>
                <ClockCircleOutlined /> {dateStr} {timeStr && `- ${timeStr}`}
              </div>
              <div>
                <TeamOutlined /> {event.currentApplied || 0} / {event.capacity || '∞'} người
              </div>
            </Space>
          </div>
        </div>
      }
      onClick={() => onCardClick(event.id)}
    >
      <Card.Meta
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span title={event.title} style={{ width: '85%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {event.title}
            </span>
            {isJoined && <CheckCircleOutlined style={{ color: '#52c41a' }} title="Đã tham gia" />}
          </div>
        }
        description={
          <Space direction="vertical" size={4} style={{ width: '100%', fontSize: 13 }}>
            <div>
              <CalendarOutlined /> {dateStr}
            </div>
            <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
              <EnvironmentOutlined /> {event.location}
            </div>
            <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Tag color="blue">
                {event.currentApplied || 0} / {event.capacity || '∞'} TNV
              </Tag>

              <Space size="small">
                <Button
                  type="default"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/event-posts/${event.id}`);
                  }}
                >
                  Trao đổi ({event.postsCount || 0})
                </Button>
                <Button type={isJoined ? 'default' : 'primary'} size="small">
                  {isJoined ? 'Đã tham gia' : 'Chi tiết'}
                </Button>
              </Space>
            </div>
          </Space>
        }
      />
    </Card>
  );
};

export default EventCard;
