import { Card, Avatar, Button, Typography, Tooltip, Input } from "antd";
import {
  LikeOutlined,
  LikeFilled, // Thêm
  MessageOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState, useEffect } from "react";
import CommentSection from "./CommentSection";
import PostImages from "./PostImages";
import { usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";
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
    updatePostContent,
  } = usePosts();
  const { user } = useAuth();
  const postId = post.id;
  const postComments = commentsMap[postId] || [];
  const isLiked = Boolean(postLikedbyUser[postId]);
  const commentsVisible = Boolean(isOpenedComments[postId]);
  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(post.content || "");

  // Sync editingContent with post.content when post updates
  useEffect(() => {
    setEditingContent(post.content || "");
  }, [post.content]);

  return (
    <Card className="fb-post-card" style={{ marginBottom: 16 }}>
      {/* --- Header --- */}
      <div className="fb-post-header" style={{gap: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
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
        
        {/* Edit button in top-right corner - only show for post owner */}
        {user && user.id === post.author?.id && (
          <div style={{ display: 'flex', gap: 4 }}>
            {isEditing ? (
              <>
                <Button
                  type="text"
                  icon={<SaveOutlined />}
                  size="small"
                  onClick={async () => {
                    if (editingContent.trim() && editingContent.trim() !== post.content) {
                      try {
                        await updatePostContent(postId, editingContent.trim());
                        setIsEditing(false);
                      } catch (error) {
                        console.error("Error updating post:", error);
                      }
                    } else {
                      setIsEditing(false);
                    }
                  }}
                  style={{ color: '#52c41a' }}
                />
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  size="small"
                  onClick={() => {
                    setIsEditing(false);
                    setEditingContent(post.content || "");
                  }}
                  style={{ color: '#ff4d4f' }}
                />
              </>
            ) : (
              <Button
                type="text"
                icon={<EditOutlined />}
                size="small"
                onClick={() => {
                  setIsEditing(true);
                  setEditingContent(post.content || "");
                }}
                style={{ color: '#666' }}
              />
            )}
          </div>
        )}
      </div>
      {/* --- Event Title --- */}
      {post.event && (
        <div className="fb-post-title" style={{ marginTop: 12 }}>
          <Text strong>{post.event.title}</Text>
        </div>
      )}
      {/* --- Content --- */}
      <div className="fb-post-content" style={{ marginTop: 12 }}>
        {isEditing ? (
          <Input.TextArea
            value={editingContent}
            onChange={(e) => setEditingContent(e.target.value)}
            rows={4}
            placeholder="Nhập nội dung bài viết..."
          />
        ) : (
          <Text>{post.content}</Text>
        )}
      </div>

      <PostImages images={post.images} />

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