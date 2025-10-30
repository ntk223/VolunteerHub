import { List, Empty, Spin } from "antd";
import { PostCard } from "./PostCard";

export const PostList = ({
  posts,
  loading,
  onLike,
  onOpenLikes,
  onToggleComments,
  commentsMap,
  onCommentChange,
  onSubmitComment,
}) => {
  const getId = (p) => p.id ?? p._id;

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
        <Spin />
      </div>
    );
  }

  if (posts.length === 0) {
    return <Empty description="Chưa có bài viết" />;
  }

  return (
    <List
      dataSource={posts}
      renderItem={(post) => {
        const postId = getId(post);
        const isLiked = Boolean(post.isLiked);
        const commentSection = commentsMap[postId];

        return (
          <PostCard
            key={postId}
            post={post}
            isLiked={isLiked}
            onLike={onLike}
            onOpenLikes={onOpenLikes}
            onToggleComments={onToggleComments}
            commentSection={commentSection}
            onCommentChange={onCommentChange}
            onSubmitComment={onSubmitComment}
          />
        );
      }}
    />
  );
};