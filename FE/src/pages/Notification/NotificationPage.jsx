import { List, Typography, Card, Badge, Empty, Button, Space, theme } from "antd";
import { BellOutlined, CheckOutlined, ClockCircleOutlined } from '@ant-design/icons';
import { useSocket } from "../../hooks/useSocket";
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

const { Text, Title } = Typography;

const NotificationPage = () => {
  const { notifications, markNotificationsAsRead } = useSocket();
  const { token } = theme.useToken();

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const formatTime = (date) => {
    try {
      return formatDistanceToNow(new Date(date), { 
        addSuffix: true, 
        locale: vi 
      });
    } catch {
      return new Date(date).toLocaleString('vi-VN');
    }
  };

  return (
    <div style={{
      background: token.colorBgLayout,
      minHeight: '100vh',
      padding: '40px 20px',
    }}>
      <Card
        style={{
          maxWidth: 800,
          margin: "0 auto",
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }} size="large">
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
            paddingBottom: 16,
          }}>
            <Space>
              <BellOutlined style={{ fontSize: 24, color: token.colorPrimary }} />
              <div>
                <Title level={3} style={{ margin: 0 }}>
                  Thông báo
                </Title>
                <Text type="secondary">
                  {unreadCount > 0 
                    ? `${unreadCount} thông báo chưa đọc` 
                    : 'Tất cả đã đọc'}
                </Text>
              </div>
            </Space>
            {unreadCount > 0 && (
              <Button 
                icon={<CheckOutlined />}
                onClick={markNotificationsAsRead}
                type="primary"
                ghost
              >
                Đánh dấu đã đọc
              </Button>
            )}
          </div>

          {/* List */}
          {notifications.length === 0 ? (
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <Space direction="vertical">
                  <Text type="secondary">Bạn chưa có thông báo nào</Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Các thông báo về sự kiện, ứng tuyển sẽ hiển thị tại đây
                  </Text>
                </Space>
              }
              style={{ padding: '40px 0' }}
            />
          ) : (
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item
                  style={{
                    background: item.isRead ? 'transparent' : token.colorPrimaryBg,
                    padding: '16px',
                    borderRadius: token.borderRadius,
                    marginBottom: 8,
                    border: `1px solid ${item.isRead ? token.colorBorderSecondary : token.colorPrimaryBorder}`,
                    transition: 'all 0.3s ease',
                  }}
                >
                  <List.Item.Meta
                    avatar={
                      <div style={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        background: item.isRead ? token.colorBgTextHover : token.colorPrimary,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 20,
                      }}>
                        {item.message.includes('được phê duyệt') ? '✅' : 
                         item.message.includes('bị từ chối') ? '❌' : '📢'}
                      </div>
                    }
                    title={
                      <Space>
                        {!item.isRead && (
                          <Badge status="processing" />
                        )}
                        <Text strong style={{ fontSize: 15 }}>
                          {item.message.includes('được phê duyệt') ? 'Sự kiện được duyệt' :
                           item.message.includes('bị từ chối') ? 'Sự kiện bị từ chối' :
                           'Thông báo mới'}
                        </Text>
                      </Space>
                    }
                    description={
                      <Space direction="vertical" size={4} style={{ width: '100%' }}>
                        <Text>{item.message}</Text>
                        <Space size={4}>
                          <ClockCircleOutlined style={{ fontSize: 12 }} />
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {formatTime(item.createdAt)}
                          </Text>
                        </Space>
                      </Space>
                    }
                  />
                </List.Item>
              )}
            />
          )}
        </Space>
      </Card>
    </div>
  );
};

export default NotificationPage;