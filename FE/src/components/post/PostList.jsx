import { List, Empty, Spin } from "antd";
import { PostCard } from "./PostCard";

export const PostList = ({posts}) => {
  // if (loading) {
  //   return (
  //     <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
  //       <Spin />
  //     </div>
  //   );
  // }

  // if (!posts || posts.length === 0) {
  //   return <Empty description="Chưa có bài viết" />;
  // }

  return (
    <List
      dataSource={posts}
      renderItem={(post) => {
        return ( <PostCard post={post} />);
      }}
    />
  );
};
