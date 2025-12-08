import React, { useState } from "react";
import { List, Card, Tag, Button, Typography, Space, Input, Spin, Empty, Tabs } from "antd";
import { 
  CalendarOutlined, 
  EnvironmentOutlined, 
  SearchOutlined, 
  CheckCircleOutlined,
  LoadingOutlined,
  ClockCircleOutlined, // Import thêm icon
  TeamOutlined         // Import thêm icon
} from "@ant-design/icons";
import EventDetailModal from "../../components/createEvent/EventDetailModal"; 
import { useAuth } from "../../hooks/useAuth";
import { useEvents } from "../../hooks/useEvents"; 

const { Title } = Typography;

const EventsPage = () => {
  const { user } = useAuth();
  const { events, loading, joinEvent, leaveEvent } = useEvents();

  const [selectedEventId, setSelectedEventId] = useState(null); 
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const selectedEvent = events.find(e => e.id === selectedEventId) || null;

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchText.toLowerCase()) ||
                          event.location.toLowerCase().includes(searchText.toLowerCase());
    
    let matchesStatus = true;
    if (statusFilter === 'open') {
        matchesStatus = event.status === 'open';
    } else if (statusFilter === 'closed') {
        matchesStatus = event.status !== 'open';
    }

    return matchesSearch && matchesStatus;
  });

  const handleModalAction = async (eventId) => {
    const currentEvent = events.find(e => e.id === eventId);
    const isJoined = currentEvent?.participants?.includes(user?.id ?? user?._id);
    
    if (isJoined) {
        await leaveEvent(eventId);
    } else {
        await joinEvent(eventId);
    }
  };

  const tabItems = [
    { key: 'all', label: 'Tất cả sự kiện' },
    { key: 'open', label: 'Đang mở đăng ký' },
    { key: 'closed', label: 'Đã kết thúc' },
  ];

  if (loading && events.length === 0) {
    return (
        <div style={{ textAlign: 'center', padding: '100px 0' }}>
            <Spin indicator={<LoadingOutlined style={{ fontSize: 40 }} spin />} tip="Đang tải sự kiện..." />
        </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: 1200, margin: '0 auto' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 16 }}>
        <Title level={2} style={{ margin: 0 }}>Sự kiện tình nguyện</Title>
        <Input 
          placeholder="Tìm kiếm sự kiện, địa điểm..." 
          prefix={<SearchOutlined />} 
          style={{ width: 300 }}
          onChange={(e) => setSearchText(e.target.value)}
        />
      </div>

      <Tabs 
        defaultActiveKey="all" 
        items={tabItems} 
        onChange={(key) => setStatusFilter(key)}
        style={{ marginBottom: 24 }}
      />

      <List
        grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }}
        dataSource={filteredEvents}
        locale={{ emptyText: <Empty description="Không tìm thấy sự kiện phù hợp" /> }}
        renderItem={(item) => {
            const isJoined = item.participants?.includes(user?.id ?? user?._id);
            // Format ngày giờ hiển thị
            const dateStr = new Date(item.date || item.startTime).toLocaleDateString('vi-VN');
            const timeStr = item.startTime ? new Date(item.startTime).toLocaleTimeString('vi-VN', {hour: '2-digit', minute:'2-digit'}) : '';

            return (
                <List.Item>
                    <Card 
                        hoverable
                        style={{ borderRadius: 12, overflow: 'hidden', height: '100%', display: 'flex', flexDirection: 'column' }}
                        bodyStyle={{ padding: 16, flex: 1 }}
                        cover={
                            <div 
                                style={{ height: 180, overflow: 'hidden', position: 'relative' }}
                                // Thêm class để xử lý hover nếu cần, ở đây dùng inline style logic
                                onMouseEnter={(e) => {
                                    const overlay = e.currentTarget.querySelector('.hover-overlay');
                                    if(overlay) overlay.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    const overlay = e.currentTarget.querySelector('.hover-overlay');
                                    if(overlay) overlay.style.opacity = '0';
                                }}
                            >
                                <img 
                                    alt={item.title} 
                                    src={item.imageUrl} 
                                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                                    onError={(e) => { e.target.src = 'https://via.placeholder.com/300x180?text=No+Image'; }}
                                />
                                <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 2 }}>
                                    <Tag color={item.status === 'open' ? 'green' : 'red'}>
                                        {item.status === 'open' ? 'Đang tuyển' : 'Đã đóng'}
                                    </Tag>
                                </div>

                                {/* --- PHẦN HIỆU ỨNG HOVER --- */}
                                <div 
                                    className="hover-overlay"
                                    style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        width: '100%',
                                        height: '100%',
                                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Nền đen mờ
                                        color: '#fff',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        opacity: 0, // Mặc định ẩn
                                        transition: 'opacity 0.3s ease-in-out',
                                        padding: '10px',
                                        textAlign: 'center',
                                        zIndex: 1
                                    }}
                                >
                                    <Space direction="vertical" size={8}>
                                        <div style={{ fontWeight: 'bold', fontSize: '15px' }}>
                                            <EnvironmentOutlined /> {item.location}
                                        </div>
                                        <div>
                                            <ClockCircleOutlined /> {dateStr} {timeStr && `- ${timeStr}`}
                                        </div>
                                        <div>
                                            <TeamOutlined /> {item.participants?.length || 0} / {item.maxMembers || '∞'} người
                                        </div>
                                    </Space>
                                </div>
                            </div>
                        }
                        onClick={() => setSelectedEventId(item.id)} 
                    >
                        <Card.Meta 
                            title={
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span title={item.title} style={{ width: '85%', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                        {item.title}
                                    </span>
                                    {isJoined && <CheckCircleOutlined style={{ color: '#52c41a' }} title="Đã tham gia" />}
                                </div>
                            }
                            description={
                                <Space direction="vertical" size={4} style={{ width: '100%', fontSize: 13 }}>
                                    <div><CalendarOutlined /> {dateStr}</div>
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '200px' }}>
                                        <EnvironmentOutlined /> {item.location}
                                    </div>
                                    <div style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <Tag color="blue">{item.participants?.length || 0} / {item.maxMembers || '∞'} TNV</Tag>
                                        
                                        <Button type={isJoined ? "default" : "primary"} size="small">
                                            {isJoined ? "Đã tham gia" : "Chi tiết"}
                                        </Button>
                                    </div>
                                </Space>
                            }
                        />
                    </Card>
                </List.Item>
            );
        }}
      />

      <EventDetailModal 
        visible={!!selectedEvent} 
        event={selectedEvent} 
        onClose={() => setSelectedEventId(null)}
        onJoinUpdate={handleModalAction} 
      />
    </div>
  );
};

export default EventsPage;