import { Card, Avatar, Button, Typography, Tooltip } from "antd";
import {
  LikeOutlined,
  LikeFilled, // Thêm
  MessageOutlined,
  UserOutlined,
} from "@ant-design/icons";
import CommentSection from "./CommentSection";
import { usePosts } from "../../hooks/usePosts";
import { Link } from "react-router-dom";
const { Text } = Typography;

const PostCard = ({post}) => {
  const {
    toggleLike,
    openLikes,
    postLikedbyUser,
    toggleComments,
    commentsMap,
    newComments,
    handleCommentChange,
    submitComment,
    isOpenedComments,
    editComment,
    deleteComment,
  } = usePosts();
  const postId = post.id;
  const postComments = commentsMap[postId] || [];
  const isLiked = Boolean(postLikedbyUser[postId]);
  const commentsVisible = Boolean(isOpenedComments[postId]);

  return (
    <Card className="fb-post-card" style={{ marginBottom: 16 }}>
      {/* --- Header --- */}
      <div className="fb-post-header" style={{gap: 10, display: 'flex', alignItems: 'center' }}>
        <Avatar size={40} src={post.author?.avatarUrl} icon={<UserOutlined />} />
        <div>
          <Link to={`/profile/${post.author?.id}`} style={{ fontWeight: 600, color: "#1677ff" }}>
            {post.author?.name || "Ẩn danh"}
          </Link>
          <div>
            <Text type="secondary" style={{ fontSize: 12 }}>
              {new Date(post.createdAt || Date.now()).toLocaleString()}
            </Text>
          </div>
        </div>
      </div>
      {/* --- Event Title --- */}
      {post.event && (
        <div className="fb-post-title" style={{ marginTop: 12 }}>
          <Text strong>{post.event.title}</Text>
        </div>
      )}
      {/* --- Content --- */}
      <div className="fb-post-content" style={{ marginTop: 12 }}>
        <Text>{post.content}</Text>
      </div>

      {/* --- Stats --- */}
      <div className="fb-post-stats" style={{ marginTop: 8, display: 'flex', justifyContent: 'space-between', cursor: 'pointer' }}>
        <Tooltip title="Xem ai đã thích">
          <Text type="secondary" onClick={() => openLikes(postId)}>
            👍 {post.likeCount || post.likes || 0}
          </Text>
        </Tooltip>
        <Tooltip title="Xem bình luận">
           <Text type="secondary" onClick={() => toggleComments(postId)}>
             💬 {post.commentCount || 0}
           </Text>
        </Tooltip>
      </div>

      {/* --- Actions --- */}
      <div className="fb-post-actions" style={{ display: "flex", gap: 10, marginTop: 8, borderTop: '1px solid #f0f0f0', paddingTop: 8 }}>
        <Button
          type="text"
          danger={isLiked}
          icon={
            isLiked ? <LikeFilled /> : <LikeOutlined />
          }
          onClick={() => toggleLike(postId)}
          style={{ flex: 1 }}
        >
          Thích
        </Button>
        <Button
          type="text"
          icon={<MessageOutlined />}
          onClick={() => toggleComments(postId)}
          style={{ flex: 1 }}
        >
          Bình luận
        </Button>
      </div>

      {/* --- Comments --- */}
      {commentsVisible && (
        <div style={{ marginTop: 12 }}>
          <CommentSection 
            postId={postId}
            comments={postComments}
            newComment={newComments[postId] || ""}
            onCommentChange={handleCommentChange}
            onSubmitComment={submitComment}
            onEditComment={editComment}
            onDeleteComment={deleteComment}
          />
        </div>
      )}
    </Card>
  );
};

export default PostCard;