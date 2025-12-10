import { Spin, Typography, Empty, Card } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { usePosts } from '../../hooks/usePosts';
import PostList from '../../components/post/PostList';
import LikesModal from '../../components/post/LikesModal';
import PostSorter from '../../components/common/PostSorter';
import { useAuth } from '../../hooks/useAuth';
import './DiscussPage.css';

const { Title, Text } = Typography;

const EventPost = () => {
  const { eventId } = useParams();
  console.log('Event ID:', eventId);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loadingEvent, setLoadingEvent] = useState(false);
  
  const {
    posts,
    likeModalVisible,
    likeUsers,
    sortBy,
    closeLikes,
    changeSortBy,
  } = usePosts(null); // Lấy tất cả posts
  // Filter posts theo eventId
  const eventPosts = posts?.filter(post => post.event?.id == eventId) || [];

  console.log('Event Posts:', eventPosts);
  if (!user || loadingEvent) {
    return (
      <div className="ant-spin-container-full">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="discuss-page-container">
       <br /> <br />
      <div className="discuss-page-content">
        <Card
          style={{
            marginBottom: 16,
            borderRadius: 12,
            boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <ArrowLeftOutlined
              style={{ fontSize: 20, cursor: 'pointer' }}
              onClick={() => navigate('/events')}
            />
            <div style={{ flex: 1 }}>
              <Title level={3} style={{ margin: 0, marginBottom: 8 }}>
                Kênh trao đổi sự kiện: {eventPosts[0]?.event?.title || ""}
              </Title>
              <Text type="secondary">
                Bài viết liên quan đến sự kiện ({eventPosts.length})
              </Text>
            </div>
          </div>
        </Card>

        <div className="post-list-wrapper">
          <PostSorter sortBy={sortBy} onSortChange={changeSortBy} />
          {eventPosts.length > 0 ? (
            <PostList posts={eventPosts} />
          ) : (
            <Empty
              description="Chưa có bài viết nào về sự kiện này"
              style={{ marginTop: 40 }}
            />
          )}
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

export default EventPost;