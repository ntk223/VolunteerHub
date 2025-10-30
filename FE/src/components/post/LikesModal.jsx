import { Modal, List, Avatar, Typography, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const LikesModal = ({ visible, loading, likes, onClose }) => {
  return (
    <Modal title="Người đã thích" open={visible} onCancel={onClose} footer={null}>
      {loading ? (
        <div style={{ textAlign: "center", padding: 16 }}>
          <Spin />
        </div>
      ) : likes.length === 0 ? (
        <Text type="secondary">Chưa có ai thích bài viết này.</Text>
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={likes}
          renderItem={(like) => {
            const u = like.user ?? like.User ?? { name: "Người dùng", role: "" };
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={u.name || "Người dùng"}
                  description={u.role ? `${u.role}` : undefined}
                />
                <div style={{ fontSize: 12, color: "#888" }}>
                  {new Date(like.createdAt).toLocaleString()}
                </div>
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
};