import { List, Empty, Spin } from "antd";
import PostCard from "./PostCard";

const PostList = ({posts}) => {
  return (
    <List
      dataSource={posts}
      renderItem={(post) => {
        return ( <PostCard post={post} />);
      }}
    />
  );
};
export default PostList;