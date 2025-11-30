import {
  Card,
  Avatar,
  Button,
  Typography,
  Tooltip,
  Input,
  message,
  Modal,
  Descriptions,
  Tag,
  Image,
} from "antd";
import {
  LikeOutlined,
  LikeFilled,
  MessageOutlined,
  UserOutlined,
  EditOutlined,
  SaveOutlined,
  CloseOutlined,
  CalendarOutlined,
  EnvironmentOutlined,
  TeamOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import CommentSection from "./CommentSection";
import PostMedia from "./PostMedia";
import EventModal from "./EventModal";
import { usePosts } from "../../hooks/usePosts";
import { useAuth } from "../../hooks/useAuth";
import { useApplications } from "../../hooks/useApplications";
import api from "../../api";

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
  const navigate = useNavigate();

  const {
    isApplied,
    loading: appliedLoading,
    refetch: refetchApplied,
    cancelApplication,
  } = useApplications(user);

  const postId = post.id;
  const postComments = commentsMap[postId] || [];
  const isLiked = Boolean(postLikedbyUser[postId]);
  const commentsVisible = Boolean(isOpenedComments[postId]);

  const [isEditing, setIsEditing] = useState(false);
  const [editingContent, setEditingContent] = useState(post.content || "");
  const [processing, setProcessing] = useState(false);

  // Modal state
  const [isModalVisible, setIsModalVisible] = useState(false);

  const getEventId = () => {
    if (!post?.event) return null;
    if (typeof post.event === "object") {
      return post.event.id || post.event.eventId || post.event._id || null;
    }
    return null;
  };

  const eventId = getEventId();
  const hasApplied = eventId ? isApplied(eventId) : false;

  const getVolunteerId = () => {
    if (!user) return null;
    return user.volunteerId || user.volunteer?._id || user.volunteer?.id || null;
  };

  const volunteerId = getVolunteerId();

  // === ỨNG TUYỂN ===
  const handleApply = async () => {
    if (!user) {
      message.info("Vui lòng đăng nhập để ứng tuyển");
      return navigate("/login");
    }
    if (!eventId || !volunteerId) return message.error("Thiếu thông tin");

    setProcessing(true);
    try {
      await api.post("/application", { eventId, volunteerId });
      message.success("Ứng tuyển thành công!");
      refetchApplied();
    } catch (err) {
      message.error(err?.response?.data?.message || "Ứng tuyển thất bại");
    } finally {
      setProcessing(false);
    }
  };

  const handleCancel = async () => {
    if (!eventId || !volunteerId) return;
    setProcessing(true);
    const success = await cancelApplication(eventId);
    if (success) refetchApplied();
    setProcessing(false);
  };

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
              <Link to={`/profile/${post.author?.id}`} style={{ fontWeight: 600, color: "#1677ff" }}>
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
            <Title level={4} style={{ margin: 0, color: "#1890ff" }}>
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
            {post.postType === "recruitment" && user?.role?.toLowerCase() === "volunteer" && (
              <Button
                type={hasApplied ? "default" : "primary"}
                danger={hasApplied}
                style={{ flex: 1 }}
                onClick={() => (hasApplied ? handleCancel() : handleApply())}
                loading={processing || appliedLoading}
                disabled={processing || appliedLoading}
              >
                {hasApplied ? "Hủy đơn" : "Ứng tuyển"}
              </Button>
            )}
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
      <EventModal event={event} isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
    </>
  );
};

export default PostCard;