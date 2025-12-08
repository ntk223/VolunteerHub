import React, { useState } from "react";
import { Modal, Button, Typography, Tag, Space, Divider, message } from "antd";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  CheckCircleOutlined 
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
// SỬA: Import useEvents thay vì useEventActions
import { useEvents } from "../../hooks/useEvents"; 

const { Title, Text, Paragraph } = Typography;
const GOOGLE_MAPS_API_KEY = ""; 

const EventDetailModal = ({ visible, onClose, event }) => {
  const { user } = useAuth();
  
  // SỬA: Lấy hàm join/leave từ useEvents
  const { joinEvent, leaveEvent } = useEvents(); 
  
  const [loading, setLoading] = useState(false);

  if (!event) return null;

  // Kiểm tra user đã tham gia chưa dựa trên mảng participants
  const isJoined = event.participants?.includes(user?.id ?? user?._id);

  const handleJoinClick = async () => {
    if (!user) {
        message.warning("Vui lòng đăng nhập để tham gia!");
        return;
    }

    setLoading(true);
    try {
        let success;
        if (isJoined) {
            success = await leaveEvent(event.id);
            if(success) message.success("Đã hủy tham gia sự kiện");
        } else {
            success = await joinEvent(event.id);
            if(success) message.success("Đăng ký tham gia thành công!");
        }
    } catch (error) {
        message.error("Có lỗi xảy ra, vui lòng thử lại.");
    } finally {
        setLoading(false);
    }
  };

  // --- LOGIC MAP ---
  const locationQuery = event.address || event.location;
  const officialMapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(locationQuery)}`;
  const legacyMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
  const mapSrc = GOOGLE_MAPS_API_KEY ? officialMapSrc : legacyMapSrc;

  // Helper function to safely render category
  const renderCategory = (category) => {
    if (!category) return "Tình nguyện";
    if (typeof category === 'object') return category.name || "Tình nguyện";
    return category;
  };

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="event-detail-modal"
      styles={{ body: { padding: '0' } }}
    >
      {/* 1. Header: Ảnh bìa */}
      <div style={{ position: 'relative', height: 250 }}>
        <img 
            src={event.imageUrl} 
            alt="Cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x250?text=Event+Image'; }}
        />
        <div style={{ position: 'absolute', bottom: 10, left: 24 }}>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 10px' }}>
                {renderCategory(event.category)}
            </Tag>
            <Tag color={event.status === 'open' ? 'green' : 'red'} style={{ fontSize: 14, padding: '4px 10px' }}>
                {event.status === 'open' ? 'Đang mở đăng ký' : 'Đã kết thúc'}
            </Tag>
        </div>
      </div>

      <div style={{ padding: 24 }}>
        <Title level={3} style={{ marginTop: 0 }}>{event.title}</Title>

        {/* 2. Thông tin chi tiết */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <CalendarOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <div>
              <Text strong>Thời gian:</Text>
              <div style={{ color: 'gray' }}>
                {new Date(event.date || event.startTime).toLocaleDateString('vi-VN')} 
                {event.startTime ? ` • ${new Date(event.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'})}` : ''}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <EnvironmentOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
            <div style={{ width: '100%' }}>
              <Text strong>Địa điểm:</Text>
              <div>{event.location}</div>
              <div style={{ fontSize: 12, color: 'gray' }}>{event.address}</div>
            </div>
          </div>
          
          {/* Map Embed */}
          <div style={{ width: '100%', height: '200px', borderRadius: '8px', overflow: 'hidden', border: '1px solid #f0f0f0', marginTop: 10 }}>
            <iframe 
              width="100%" height="100%" src={mapSrc} frameBorder="0" scrolling="no" title="Location" loading="lazy"
            ></iframe>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <TeamOutlined style={{ fontSize: 20, color: '#52c41a' }} />
            <div>
              <Text strong>Đã tham gia:</Text>
              <div>{event.participants?.length || 0} / {event.maxMembers || '∞'} người</div>
            </div>
          </div>
        </Space>

        <Divider />

        <div>
          <Title level={5}>Mô tả sự kiện</Title>
          <Paragraph style={{ whiteSpace: 'pre-line' }}>
            {event.description}
          </Paragraph>
        </div>

        <div style={{ marginTop: 24, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 12 }}>
            Đóng
          </Button>
          
          <Button 
            type="primary" 
            size="large"
            loading={loading}
            onClick={handleJoinClick}
            disabled={event.status !== 'open' && !isJoined}
            icon={isJoined ? <CheckCircleOutlined /> : null}
            style={{
              backgroundColor: isJoined ? '#52c41a' : '#1677ff',
              borderColor: isJoined ? '#52c41a' : '#1677ff',
              minWidth: 150
            }}
          >
            {isJoined ? "Đã tham gia" : "Tham gia ngay"}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailModal;