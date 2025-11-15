import { usePosts } from '../../hooks/usePosts';
import PostList from '../../components/post/PostList';
import LikesModal from '../../components/post/LikesModal';
import PostSorter from '../../components/common/PostSorter';
import { useAuth } from '../../hooks/useAuth';
import '../Feed/DiscussPage.css';
import { useParams } from 'react-router-dom';

const UserPost = () => {    
    const { id: userId } = useParams();
    console.log("UserPost userId:", userId);
  const { user } = useAuth();
  
  // 2. GỌI HOOK LẤY TẤT CẢ DATA VÀ HÀM
  const {
    posts,
    likeModalVisible,
    likeUsers,
    sortBy,
    closeLikes,
    changeSortBy,
  } = usePosts();
  
  const userPosts = posts?.filter(post => post.author?.id === Number(userId));

  // Xử lý khi đang tải hoặc chưa đăng nhập
  if (!userPosts || userPosts.length === 0) { 
      return (
        <div className="ant-spin-container-full">
            Người dùng này chưa có bài viết.
        </div>
      );
  }

  return (
    <div className="discuss-page-container"> 
      <div className="discuss-page-content"> 
        <div className="post-list-wrapper">
            <PostSorter sortBy={sortBy} onSortChange={changeSortBy} />
            <PostList posts={userPosts} />
        </div>
      </div>

      <LikesModal
        visible={likeModalVisible}
        likes={likeUsers}
        onClose={closeLikes}
      />
    </div>
  );
};

export default UserPost;