import { usePosts } from '../../hooks/usePosts';
import PostList from '../../components/post/PostList';
import LikesModal from '../../components/post/LikesModal';
import { useAuth } from '../../hooks/useAuth';
import './DiscussPage.css';
import { useParams } from 'react-router-dom';

const UserPost = () => {    
    const { id: postId } = useParams();
    // console.log("UserPost postId:", postId);
  const { user } = useAuth();
  
  // 2. GỌI HOOK LẤY TẤT CẢ DATA VÀ HÀM
  const {
    posts,
    likeModalVisible,
    likeUsers,
    closeLikes,
  } = usePosts();
  
  const post = posts?.find(post => post.id === Number(postId));

  // Xử lý khi đang tải hoặc chưa đăng nhập
  if (!post) { 
      return (
        <div className="ant-spin-container-full">
            Bài viết không tồn tại.
        </div>
      );
  }

  return (
    <div className="discuss-page-container"> 
      <div className="discuss-page-content"> 
        <div className="post-list-wrapper">
            <PostList posts={[post]} />
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