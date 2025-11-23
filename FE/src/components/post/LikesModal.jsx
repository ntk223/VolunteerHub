import { Modal, List, Avatar, Typography, Spin, Empty } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

export const LikesModal = ({ visible, loading = false, likes = [], onClose }) => {
  return (
    <Modal
      title="Người đã thích bài viết"
      open={visible}
      onCancel={onClose}
      footer={null}
      centered
    >
      {loading ? (
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      ) : likes.length === 0 ? (
        <Empty description="Chưa có ai thích bài viết này." />
      ) : (
        <List
          itemLayout="horizontal"
          dataSource={likes}
          renderItem={(like) => {
            const user = like.user;
            return (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src={user.avatarUrl} icon={<UserOutlined />} />}
                  title={user.name || "Người dùng"}
                  description={user.role || undefined}
                />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {like.createdAt
                    ? new Date(like.createdAt).toLocaleString()
                    : ""}
                </Text>
              </List.Item>
            );
          }}
        />
      )}
    </Modal>
  );
};

export default LikesModal;
