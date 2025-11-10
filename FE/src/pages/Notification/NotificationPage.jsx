import { List, Typography, Card, Badge } from "antd";
// 1. Chỉ cần import useSocket
import { useSocket } from "../../hooks/useSocket";
// 2. Không cần: useState, useEffect, api, useAuth

const { Text } = Typography;

const NotificationPage = () => {
  // 3. Lấy notifications trực tiếp từ hook
  const { notifications } = useSocket();

  // 4. Xoá CẢ HAI useEffect (fetch và listen)
  // ... không còn useEffect nào ở đây ...

  return (
    <Card
      title={
        <span>
          🔔 Thông báo ({notifications.length})
        </span>
      }
      style={{
        maxWidth: 600,
        margin: "40px auto",
        borderRadius: 12,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
      }}
    >
      {notifications.length === 0 ? (
        <Text type="secondary">Bạn chưa có thông báo nào.</Text>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={notifications} // Dùng trực tiếp
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                title={
                  <Badge dot={!item.isRead}>
                    <Text strong>{item.title}</Text>
                  </Badge>
                }
                description={<Text>{item.message}</Text>}
              />
              <Text type="secondary" style={{ fontSize: 12 }}>
                {new Date(item.createdAt).toLocaleString("vi-VN")}
              </Text>
            </List.Item>
          )}
        />
      )}
    </Card>
  );
};

export default NotificationPage;