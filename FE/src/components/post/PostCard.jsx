import { Card, Avatar, Typography, Button } from "antd";
import { UserOutlined, LikeOutlined, MessageOutlined } from "@ant-design/icons";
import { CommentSection } from "./CommentSection";
import "./PostCard.css";

const { Text } = Typography;

export const PostCard = ({
  post,
  isLiked,
  onLike,
  onOpenLikes,
  onToggleComments,
  // comment props
  commentSection,
  onCommentChange,
  onSubmitComment,
}) => {
  const postId = post.id ?? post._id;

  return (
    <Card className="fb-post-card">
      {/* Header */}
      <div className="fb-post-header">
        <Avatar size={40} icon={<UserOutlined />} />
        <div className="fb-post-header-info">
          <Text strong className="fb-post-author">
            {post.author?.name || "Ẩn danh"}
          </Text>
          <Text type="secondary" className="fb-post-time">
            {" "}11 giờ
          </Text>
        </div>
      </div>

      {/* Nội dung */}
      <div className="fb-post-content">
        {post.event?.title && (
          <Text strong style={{ display: "block", marginBottom: 4 }}>
            {post.event.title}
          </Text>
        )}
        <Text style={{ whiteSpace: "pre-line" }}>{post.content}</Text>
      </div>

      {/* Số lượng tương tác */}
      <div className="fb-post-stats">
        <div
          className="fb-post-likes"
          onClick={() => onOpenLikes(postId)}
          style={{ cursor: "pointer", display: "inline-block" }}
          title="Xem ai đã thích"
        >
          👍 {post.likeCount || 0}
        </div>
        <div className="fb-post-comments">{post.commentCount || 0} bình luận</div>
      </div>

      {/* Thanh hành động */}
      <div className="fb-post-actions">
        <Button
          type="text"
          icon={<LikeOutlined style={{ color: isLiked ? "#1890ff" : undefined }} />}
          onClick={() => onLike(post)}
        >
          Thích
        </Button>
        <Button
          type="text"
          icon={<MessageOutlined />}
          onClick={() => onToggleComments(postId)}
        >
          Bình luận
        </Button>
      </div>

      {/* Comment section */}
      {commentSection && (
        <CommentSection
          comments={commentSection}
          onCommentChange={(value) => onCommentChange(postId, value)}
          onSubmit={() => onSubmitComment(postId)}
        />
      )}
    </Card>
  );
};