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
        <div style={{ marginTop: 8, display: "flex", justifyContent: "space-between", cursor: "pointer" }}>
          <Tooltip title="Xem ai đã thích">
            <Text type="secondary" onClick={() => openLikes(postId)}>
              {post.likeCount || post.likes || 0}
            </Text>
          </Tooltip>
          <Tooltip title="Xem bình luận">
            <Text type="secondary" onClick={() => toggleComments(postId)}>
              {post.commentCount || 0}
            </Text>
          </Tooltip>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 10, marginTop: 8, paddingTop: 8, borderTop: "1px solid #f0f0f0" }}>
          <Button
            type="text"
            danger={isLiked}
            icon={isLiked ? <LikeFilled /> : <LikeOutlined />}
            onClick={() => toggleLike(postId)}
            style={{ flex: 1 }}
          >
            Thích
          </Button>

          <Button type="text" icon={<MessageOutlined />} onClick={() => toggleComments(postId)} style={{ flex: 1 }}>
            Bình luận
          </Button>

          {/* Nút Ứng tuyển / Hủy đơn */}
          {post.postType === "recruitment" &&
            user &&
            (user.role || "").toLowerCase() === "volunteer" && (
              <Button
                type={hasApplied ? "default" : "primary"}
                danger={hasApplied}
                onClick={() => (hasApplied ? handleCancel() : handleApply())}
                loading={processing || appliedLoading}
                disabled={processing || appliedLoading}
                style={{ flex: 1 }}
              >
                {hasApplied ? "Hủy đơn ứng tuyển" : "Ứng tuyển"}
              </Button>
            )}
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
      <Modal
        title={<Title level={3}>{event?.title || "Chi tiết sự kiện"}</Title>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {event && (
          <div>
            {event.media && (
              <Image src={event.media} alt={event.title} style={{ width: "100%", borderRadius: 8, marginBottom: 16 }} />
            )}

            <Descriptions bordered column={1}>
              <Descriptions.Item label={<><CalendarOutlined /> Thời gian</>}>
                {event.startTime && new Date(event.startTime).toLocaleString("vi-VN")}
                {event.endTime && ` → ${new Date(event.endTime).toLocaleString("vi-VN")}`}
              </Descriptions.Item>

              <Descriptions.Item label={<><EnvironmentOutlined /> Địa điểm</>}>
                {event.location || "Chưa cập nhật"}
              </Descriptions.Item>

              <Descriptions.Item label={<><TeamOutlined /> Số lượng cần tuyển</>}>
                {event.capacity || event.slots || "Không giới hạn"}
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả chi tiết">
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {event.description || "Không có mô tả"}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    </>
  );
};

export default PostCard;