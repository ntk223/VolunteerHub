import {
  Card,
  Avatar,
  Button,
  Typography,
  Input,
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Link } from "react-router-dom";

import CommentSection from "./CommentSection";
import PostMedia from "./PostMedia";
import { usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";
import EventDetailModal from "../createEvent/EventDetailModal";

const { Text, Title } = Typography;

const PostCard = ({ post }) => {
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

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showEventDetail = () => {
    if (post.event) {
      setIsModalVisible(true);
    }
    console.log(post.event);
  };

  const event = post.event;

  return (
    <>
      <Card className="fb-post-card" style={{ marginBottom: 16 }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 10 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar size={40} src={post.author?.avatarUrl} icon={<UserOutlined />} />
            <div>
              <Link to={`/profile/${post.author?.id}`} style={{ fontWeight: 600, color: "#FA541C" }}>
                {post.author?.name || "Ẩn danh"}
              </Link>
              <div>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {new Date(post.createdAt || Date.now()).toLocaleString("vi-VN")}
                </Text>
              </div>
            </div>
          </div>

          {/* Edit button */}
          {user && user.id === post.author?.id && (
            <div style={{ display: "flex", gap: 4 }}>
              {isEditing ? (
                <>
                  <Button
                    type="text"
                    icon={<SaveOutlined />}
                    size="small"
                    onClick={async () => {
                      if (editingContent.trim() && editingContent.trim() !== post.content) {
                        await updatePostContent(postId, editingContent.trim());
                      }
                      setIsEditing(false);
                    }}
                    style={{ color: "#52c41a" }}
                  />
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => {
                      setIsEditing(false);
                      setEditingContent(post.content || "");
                    }}
                    style={{ color: "#ff4d4f" }}
                  />
                </>
              ) : (
                <Button
                  type="text"
                  icon={<EditOutlined />}
                  size="small"
                  onClick={() => setIsEditing(true)}
                  style={{ color: "#666" }}
                />
              )}
            </div>
          )}
        </div>

        {/* Event Title - CLICK ĐƯỢC */}
        {event && (
          <div style={{ marginTop: 12, cursor: "pointer" }} onClick={showEventDetail}>
            <Title level={4} style={{ margin: 0, color: "#FA541C" }}>
              {event.title}
            </Title>
          </div>
        )}

        {/* Content */}
        <div style={{ marginTop: 12 }}>
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

        <PostMedia media={post.media} />

        {/* Stats */}
        <div style={{ paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
          {/* Hiển thị lượt thích và bình luận */}
          <div style={{ display: "flex", gap: 16, marginBottom: 8, fontSize: 14, color: "#555" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => openLikes(postId)}>
              <LikeOutlined /> {post.likeCount || post.likes || 0}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, cursor: "pointer" }} onClick={() => toggleComments(postId)}>
              <MessageOutlined /> {post.commentCount || 0}
            </div>
          </div>

          {/* Nút hành động */}
          <div style={{ display: "flex", gap: 8 }}>
            <Button type="text" danger={isLiked} icon={isLiked ? <LikeFilled /> : <LikeOutlined />} style={{ flex: 1 }} onClick={() => toggleLike(postId)}>
              Thích
            </Button>
            <Button type="text" icon={<MessageOutlined />} style={{ flex: 1 }} onClick={() => toggleComments(postId)}>
              Bình luận
            </Button>
          </div>
        </div>



        {/* Comments */}
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

      {/* MODAL CHI TIẾT SỰ KIỆN */}
      <EventDetailModal
        visible={isModalVisible}
        event={event}
        onClose={() => setIsModalVisible(false)}
      />
    </>
  );
};

export default PostCard;