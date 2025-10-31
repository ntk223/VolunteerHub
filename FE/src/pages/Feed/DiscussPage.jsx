import { usePosts } from '../../hooks/usePosts';
import { PostList } from '../../components/post/PostList';
import { LikesModal } from '../../components/post/LikesModal';
import { useAuth } from '../../hooks/useAuth';

const DiscussPage = () => {
  const { user } = useAuth();
  
  // 2. GỌI HOOK LẤY TẤT CẢ DATA VÀ HÀM
  const {
    posts,
    likeModalVisible,
    likeUsers,
    closeLikes,
  } = usePosts('discuss');

  if (!user) return <Spin />;

  return (
    <>
      <PostList posts={posts} />

      <LikesModal
        visible={likeModalVisible}
        likes={likeUsers}
        onClose={closeLikes}
      />
    </>
  );
};

export default DiscussPage;