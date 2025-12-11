import { Input, Button, List, Avatar, Spin, Typography, Dropdown, message, Modal } from "antd";
import { UserOutlined, MoreOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import { useAuth } from "../../hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { vi } from "date-fns/locale";

const { Text } = Typography;

const CommentSection = ({ 
  postId, 
  comments,       // 👈 Nhận từ props
  newComment,     // 👈 Nhận từ props
  onCommentChange,  // 👈 Nhận từ props
  onSubmitComment,  // 👈 Nhận từ props
  onEditComment,    // 👈 Thêm callback để sửa comment
  onDeleteComment,  // 👈 Thêm callback để xóa comment
}) => {
  const { user } = useAuth();
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingContent, setEditingContent] = useState("");

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingContent(comment.content);
  };

  const handleSaveEdit = async (commentId) => {
    try {
      await onEditComment(commentId, editingContent);
      setEditingCommentId(null);
      setEditingContent("");
      message.success("Cập nhật bình luận thành công");
    } catch (error) {
      message.error("Có lỗi xảy ra khi cập nhật bình luận", error.response?.data?.message || "");
    }
  };

  const handleCancelEdit = () => {
    setEditingCommentId(null);
    setEditingContent("");
  };

  const handleDeleteComment = (commentId) => {
    Modal.confirm({
      title: "Xóa bình luận",
      content: "Bạn có chắc chắn muốn xóa bình luận này?",
      okText: "Xóa",
      cancelText: "Hủy",
      okType: "danger",
      onOk: async () => {
        try {
          await onDeleteComment(commentId);
          message.success("Xóa bình luận thành công");
        } catch (error) {
          message.error("Có lỗi xảy ra khi xóa bình luận", error.response?.data?.message || "");
        }
      },
    });
  };

  const getMenuItems = (comment) => [
    {
      key: "edit",
      icon: <EditOutlined />,
      label: "Sửa",
      onClick: () => handleEditComment(comment),
    },
    {
      key: "delete",
      icon: <DeleteOutlined />,
      label: "Xóa",
      onClick: () => handleDeleteComment(comment.id),
      danger: true,
    },
  ];
  
  return (
    <>
      <List
        dataSource={comments} // 👈 Dùng 'comments' từ props
        locale={{ emptyText: "Chưa có bình luận nào" }}
        renderItem={(c) => {
          
          const isOwner = user?.id && c.author?.id && String(user.id) === String(c.author.id);
          
          return (
            <List.Item
              actions={
                isOwner ? [
                  <Dropdown
                    key="dropdown"
                    menu={{ items: getMenuItems(c) }}
                    trigger={['click']}
                    placement="bottomRight"
                  >
                    <Button type="text" icon={<MoreOutlined />} />
                  </Dropdown>
                ] : []
              }
            >
            <List.Item.Meta
              avatar={<Avatar src={c.author?.avatarUrl} icon={<UserOutlined />} />}
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text strong>{c.author?.name || "Người dùng"}</Text>
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {c.createdAt && formatDistanceToNow(new Date(c.createdAt), { 
                      addSuffix: true, 
                      locale: vi 
                    })}
                  </Text>
                </div>
              }
              description={
                editingCommentId === c.id ? (
                  <div>
                    <Input.TextArea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      rows={2}
                      style={{ marginBottom: 8 }}
                    />
                    <div>
                      <Button
                        type="primary"
                        size="small"
                        onClick={() => handleSaveEdit(c.id)}
                        style={{ marginRight: 8 }}
                      >
                        Lưu
                      </Button>
                      <Button
                        size="small"
                        onClick={handleCancelEdit}
                      >
                        Hủy
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Text style={{ color: 'rgba(0, 0, 0, 0.88)', fontSize: '14px' }}>
                    {c.content}
                  </Text>
                )
              }
            />
          </List.Item>
          );
        }}
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
