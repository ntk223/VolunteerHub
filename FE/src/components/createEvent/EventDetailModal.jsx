import React, { useState, useEffect } from "react";
import { Modal, Button, Typography, Tag, Space, Divider, message } from "antd";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  TeamOutlined, 
  CheckCircleOutlined,
  CloseCircleOutlined 
} from "@ant-design/icons";
import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents"; 
import api from "../../api";

const { Title, Text, Paragraph } = Typography;
const GOOGLE_MAPS_API_KEY = ""; 

const EventDetailModal = ({ visible, onClose, event, isAdmin = false }) => {
  const { user } = useAuth();
  const { joinEvent, leaveEvent } = useEvents(); 
  
  const [loading, setLoading] = useState(false);
  const [hasApplied, setHasApplied] = useState(false);
  const [applicationId, setApplicationId] = useState(null);
  const [checkingApplication, setCheckingApplication] = useState(false);

  // Kiểm tra xem user đã ứng tuyển chưa
  useEffect(() => {
    const checkApplication = async () => {
      if (!user || !event || isAdmin || user.role !== 'volunteer') {
        setHasApplied(false);
        setApplicationId(null);
        return;
      }

      setCheckingApplication(true);
      try {
        const volunteerId = user.volunteerId ?? user.volunteer?.id;
        if (!volunteerId) {
          setHasApplied(false);
          return;
        }

        const res = await api.get(`/application/volunteer/${volunteerId}`);
        const applications = Array.isArray(res.data) ? res.data : res.data.applications || [];
        
        // Tìm đơn ứng tuyển cho sự kiện này (chưa bị hủy)
        const existingApplication = applications.find(app => 
          app.eventId === event.id && 
          app.isCancelled !== true && 
          app.isCancelled !== 1 &&
          (app.status ?? "").toLowerCase() !== "cancelled"
        );

        if (existingApplication) {
          setHasApplied(true);
          setApplicationId(existingApplication.id);
        } else {
          setHasApplied(false);
          setApplicationId(null);
        }
      } catch (error) {
        console.error("Error checking application:", error);
        setHasApplied(false);
        setApplicationId(null);
      } finally {
        setCheckingApplication(false);
      }
    };

    if (visible) {
      checkApplication();
    }
  }, [user, event, visible, isAdmin]);

  if (!event) return null;

  // Kiểm tra user đã tham gia chưa dựa trên mảng participants (giữ logic cũ)
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

  const handleCancelApplication = async () => {
    if (!applicationId) {
      message.error("Không tìm thấy đơn ứng tuyển");
      return;
    }

    setLoading(true);
    try {
      await api.patch(`/application/${applicationId}/cancel`);
      message.success("Đã hủy đơn ứng tuyển thành công");
      setHasApplied(false);
      setApplicationId(null);
    } catch (error) {
      console.error("Cancel application error:", error);
      message.error("Hủy đơn ứng tuyển thất bại");
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
            src={event.imgUrl} 
            alt="Cover" 
            style={{ width: '100%', height: '100%', objectFit: 'cover', borderTopLeftRadius: 8, borderTopRightRadius: 8 }} 
            onError={(e) => { e.target.src = 'https://via.placeholder.com/800x250?text=Event+Image'; }}
        />
        <div style={{ position: 'absolute', bottom: 10, left: 24 }}>
            <Tag color="blue" style={{ fontSize: 14, padding: '4px 10px' }}>
                {renderCategory(event.category)}
            </Tag>
            <Tag color={event.progressStatus === 'incomplete' ? 'yellow' : event.progressStatus === 'completed' ? 'green' : 'red'} style={{ fontSize: 14, padding: '4px 10px' }}>
                {event.progressStatus === 'incomplete' ? 'Đang mở đăng ký' : event.progressStatus === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
            </Tag>
        </div>
      </div>
      <div style={{ padding: 24 }}>
        <Title level={3} style={{ marginTop: 0 }}>{event.title}</Title>

        {/* 2. Thông tin chi tiết */}
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <div style={{ display: 'flex', gap: 12 }}>
            <CalendarOutlined style={{ fontSize: 20, color: '#FA541C' }} />
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
              <div>{event.currentApplied || 0} / {event.capacity || '∞'} người</div>
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
          
          {(!isAdmin && user?.role === 'volunteer' && event.progressStatus === 'incomplete') && (
            hasApplied ? (
              <Button 
                danger
                size="large"
                loading={loading || checkingApplication}
                onClick={handleCancelApplication}
                icon={<CloseCircleOutlined />}
                style={{ minWidth: 180 }}
              >
                Hủy đơn ứng tuyển
              </Button>
            ) : (
              <Button 
                type="primary" 
                size="large"
                loading={loading || checkingApplication}
                onClick={handleJoinClick}
                disabled={event.progressStatus !== 'incomplete' && !isJoined}
                icon={isJoined ? <CheckCircleOutlined /> : null}
                style={{
                  backgroundColor: isJoined ? '#52c41a' : '#FA541C',
                  borderColor: isJoined ? '#52c41a' : '#FA541C',
                  minWidth: 150
                }}
              >
                {isJoined ? "Đã tham gia" : "Tham gia ngay"}
              </Button>
            )
          )}
        </div>
      </div>
    </Modal>
  );
};

export default EventDetailModal;