import React from "react";
import { Modal, Button, Typography, Tag, Space, Divider, Alert } from "antd";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  CheckCircleOutlined 
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useEventActions } from "../../hooks/useEvents"; 

const { Title, Text, Paragraph } = Typography;

// 🔑 ĐIỀN API KEY CỦA BẠN VÀO ĐÂY
// Để lấy Key: https://console.cloud.google.com/ -> Enable "Maps Embed API"
const GOOGLE_MAPS_API_KEY = ""; 

const EventDetailModal = ({ visible, onClose, event }) => {
  const { user } = useAuth();
  const { joinEvent, leaveEvent, loading } = useEventActions();

  if (!event) return null;

  const isJoined = event.participants?.includes(user?.uid);

  const handleJoinClick = async () => {
    if (isJoined) {
       // Logic hủy (nếu cần)
    } else {
       await joinEvent(event.id, user.uid);
    }
  };

  // --- LOGIC MAP (SỬ DỤNG GOOGLE MAPS EMBED API) ---
  const locationQuery = event.address || event.location;
  
  // 1. URL Dùng API Chính Thức (Cần API Key)
  // Mode "place" cho phép tìm kiếm theo tên địa điểm hoặc địa chỉ
  const officialMapSrc = `https://www.google.com/maps/embed/v1/place?key=${GOOGLE_MAPS_API_KEY}&q=${encodeURIComponent(locationQuery)}`;

  // 2. URL Fallback (Miễn phí / Legacy) - Dùng khi chưa có API Key
  const legacyMapSrc = `https://maps.google.com/maps?q=${encodeURIComponent(locationQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  // Tự động chọn nguồn map: Nếu có Key thì dùng Official, không thì dùng Legacy
  const mapSrc = GOOGLE_MAPS_API_KEY ? officialMapSrc : legacyMapSrc;

  return (
    <Modal
      open={visible}
      onCancel={onClose}
      footer={null}
      width={800}
      centered
      className="event-detail-modal"
      styles={{ body: { padding: '24px' } }}
    >
      {/* 1. Header: Ảnh bìa & Tiêu đề */}
      <div style={{ marginBottom: 20 }}>
        {event.imageUrl && (
          <img 
            src={event.imageUrl} 
            alt="Cover" 
            style={{ 
              width: '100%', 
              height: 250, 
              objectFit: 'cover', 
              borderRadius: 12, 
              marginBottom: 16,
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }} 
          />
        )}
        <Title level={3} style={{ margin: 0, color: "var(--text-color)" }}>{event.title}</Title>
        <Space style={{ marginTop: 8 }}>
          <Tag color="blue">{event.category || "Tình nguyện"}</Tag>
          <Tag color={event.status === 'open' ? 'green' : 'red'}>
            {event.status === 'open' ? 'Đang mở đăng ký' : 'Đã kết thúc'}
          </Tag>
        </Space>
      </div>

      <div style={{ display: 'flex', gap: 24, flexDirection: 'column' }}>
        
        {/* 2. Thông tin chi tiết */}
        <Space direction="vertical" size="middle">
          <div style={{ display: 'flex', gap: 12 }}>
            <CalendarOutlined style={{ fontSize: 20, color: '#1677ff' }} />
            <div>
              <Text strong style={{ color: "var(--text-color)" }}>Thời gian:</Text>
              <div style={{ color: 'var(--text-secondary)' }}>
                {event.date} • {event.time}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12 }}>
            <EnvironmentOutlined style={{ fontSize: 20, color: '#ff4d4f' }} />
            <div style={{ width: '100%' }}>
              <Text strong style={{ color: "var(--text-color)" }}>Địa điểm:</Text>
              <div style={{ fontSize: 16, color: "var(--text-color)" }}>{event.location}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 8 }}>
                {event.address}
              </div>
            </div>
          </div>
          
          {/* --- GOOGLE MAP EMBED --- */}
          <div style={{ 
            width: '100%', 
            height: '350px', 
            borderRadius: '12px', 
            overflow: 'hidden',
            border: '1px solid var(--border-color)',
            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.05)',
            position: 'relative'
          }}>
            {!GOOGLE_MAPS_API_KEY && (
               <div style={{ 
                 position: 'absolute', top: 0, left: 0, right: 0, 
                 background: 'rgba(255,255,0,0.2)', padding: '4px', textAlign: 'center', fontSize: '10px', zIndex: 10 
               }}>
                 Đang dùng chế độ bản đồ miễn phí (Legacy). Hãy thêm API Key để dùng chế độ chuẩn.
               </div>
            )}
            <iframe 
              width="100%" 
              height="100%" 
              src={mapSrc}
              frameBorder="0" 
              scrolling="no" 
              marginHeight="0" 
              marginWidth="0"
              title="Event Location"
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              style={{ filter: "grayscale(0.1)" }}
            ></iframe>
          </div>

          <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
            <TeamOutlined style={{ fontSize: 20, color: '#52c41a' }} />
            <div>
              <Text strong style={{ color: "var(--text-color)" }}>Đã tham gia:</Text>
              <div style={{ color: "var(--text-color)" }}>
                {event.participants?.length || 0} người
              </div>
            </div>
          </div>
        </Space>

        <Divider style={{ margin: '12px 0', borderColor: "var(--border-color)" }} />

        <div>
          <Title level={5} style={{ color: "var(--text-color)" }}>Mô tả sự kiện</Title>
          <Paragraph style={{ whiteSpace: 'pre-line', color: "var(--text-color)" }}>
            {event.description}
          </Paragraph>
        </div>

        <div style={{ marginTop: 12, textAlign: 'right' }}>
          <Button onClick={onClose} style={{ marginRight: 12 }}>
            Đóng
          </Button>
          
          <Button 
            type="primary" 
            size="large"
            loading={loading}
            onClick={handleJoinClick}
            disabled={isJoined}
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