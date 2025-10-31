import { Input, Button, List, Avatar, Spin, Typography } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const CommentSection = ({ 
  postId, 
  comments,       // 👈 Nhận từ props
  newComment,     // 👈 Nhận từ props
  onCommentChange,  // 👈 Nhận từ props
  onSubmitComment,  // 👈 Nhận từ props
}) => {
  
  
  return (
    <>
      <List
        dataSource={comments} // 👈 Dùng 'comments' từ props
        locale={{ emptyText: "Chưa có bình luận nào" }}
        renderItem={(c) => (
          <List.Item>
            <List.Item.Meta
              avatar={<Avatar src={c.author?.avatarUrl} icon={<UserOutlined />} />}
              title={<Text strong>{c.author?.name || "Người dùng"}</Text>}
              description={c.content}
            />
          </List.Item>
        )}
      />

      {/* Phần input này giờ được kiểm soát bởi HOOK */}
      <Input.TextArea
        value={newComment} // 👈 Dùng 'newComment' từ props
        onChange={(e) => onCommentChange(postId, e.target.value)} // 👈 Gọi hàm từ props
        rows={2}
        placeholder="Viết bình luận..."
      />

      <Button
        type="primary"
        size="small"
        onClick={() => onSubmitComment(postId)} // 👈 Gọi hàm từ props
        style={{ marginTop: 6 }}
      >
        Gửi
      </Button>
    </>
  );
};

export default CommentSection;
