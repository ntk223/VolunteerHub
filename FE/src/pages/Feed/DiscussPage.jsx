import React from 'react'; 
import { Spin } from 'antd'; 
import { usePosts } from '../../hooks/usePosts';
import { PostList } from '../../components/post/PostList';
import { LikesModal } from '../../components/post/LikesModal';
import { useAuth } from '../../hooks/useAuth';
import './DiscussPage.css';

const DiscussPage = () => {
  const { user } = useAuth();
  
  // 2. GỌI HOOK LẤY TẤT CẢ DATA VÀ HÀM
  const {
    posts,
    likeModalVisible,
    likeUsers,
    closeLikes,
  } = usePosts('discuss');

  // Xử lý khi đang tải hoặc chưa đăng nhập
  if (!user || !posts) { 
      return (
        <div className="ant-spin-container-full">
            <Spin size="large" />
        </div>
      );
  }

  return (
    <div className="discuss-page-container"> 
      <div className="discuss-page-content"> 
        <div className="post-list-wrapper"> 
            <PostList posts={posts} />
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

export default DiscussPage;