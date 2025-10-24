import "./Home.css";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
import api from "../../api";
import {
  Layout,
  Menu,
  Typography,
  Button,
  Space,
  Avatar,
  Input,
  Tabs,
  Card,
  List,
  message,
  Empty,
  Spin,
  Modal,
} from "antd";
import {
  HomeOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
  SearchOutlined,
  LikeOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { useAuth } from "../../contexts/AuthContext";
const { Header, Sider, Content } = Layout;
const { Title, Text } = Typography;

const Home = () => {
  const { logout, user } = useAuth();
  const userId = user?.id ?? user?._id ?? null;

  const [selectedMenu, setSelectedMenu] = useState("home");
  const [tabKey, setTabKey] = useState("discuss");
  const containerRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  // commentsMap: { [postId]: { items: [], loading: bool, visible: bool, input: string } }
  const [commentsMap, setCommentsMap] = useState({});

  // likes modal
  const [likesModalVisible, setLikesModalVisible] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
  const [likesList, setLikesList] = useState([]);
  const [likesModalPostId, setLikesModalPostId] = useState(null);

  const getId = (p) => p.id ?? p._id;

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const res = await api.get("/post/discuss");
        const list = Array.isArray(res.data) ? res.data : [];
        setPosts(list);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải bài viết");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [logout]);

  // helper: refresh likeCount + isLiked for a post by querying likes endpoint
  const refreshLikesForPost = async (postId) => {
    try {
      const res = await api.get(`/like/post/${postId}`);
      const likes = Array.isArray(res.data) ? res.data : [];
      const count = likes.length;
      const likedByUser = userId ? likes.some((l) => (l.user?.id ?? l.user?._id ?? l.user_id ?? l.userId) == userId) : false;
      setPosts((prev) => prev.map((p) => (getId(p) === postId ? { ...p, likeCount: count, isLiked: likedByUser } : p)));
      // also populate modal list if it's open for this post
      if (likesModalPostId === postId) setLikesList(likes);
    } catch (err) {
      console.error(err);
    }
  };

  // toggle like/unlike with optimistic update and DB persistence
  const toggleLike = async (post) => {
    if (!userId) {
      message.error("Vui lòng đăng nhập để thích bài viết");
      return;
    }
    const postId = getId(post);
    const currentlyLiked = Boolean(post.isLiked) || false;
    // optimistic update
    setPosts((prev) =>
      prev.map((p) =>
        getId(p) === postId
          ? {
              ...p,
              likeCount: Math.max(0, (p.likeCount || 0) + (currentlyLiked ? -1 : 1)),
              isLiked: !currentlyLiked,
            }
          : p
      )
    );

    try {
      if (!currentlyLiked) {
        // like
        //await api.post("/like", { postId });
        await api.post("/like", { post_id: postId, user_id: userId });
      } else {
        // unlike - use DELETE with body
        await api.delete("/like", { data: { postId } });
      }
      // after mutation, refresh authoritative like list/count from server
      await refreshLikesForPost(postId);
    } catch (err) {
      console.error(err);
      message.error("Không thể cập nhật lượt thích. Vui lòng thử lại.");
      // revert optimistic change
      setPosts((prev) =>
        prev.map((p) =>
          getId(p) === postId
            ? {
                ...p,
                likeCount: currentlyLiked ? (p.likeCount || 0) + 1 : Math.max(0, (p.likeCount || 1) - 1),
                isLiked: currentlyLiked,
              }
            : p
        )
      );
    }
  };

  // open modal and fetch likes for a post
  const openLikes = async (postId) => {
    setLikesModalPostId(postId);
    setLikesModalVisible(true);
    setLikesLoading(true);
    try {
      const res = await api.get(`/like/post/${postId}`);
      setLikesList(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      message.error("Không thể tải danh sách người đã thích");
      setLikesList([]);
    } finally {
      setLikesLoading(false);
    }
  };

  const closeLikes = () => {
    setLikesModalVisible(false);
    setLikesList([]);
    setLikesModalPostId(null);
    setLikesLoading(false);
  };

  const toggleComments = async (postId) => {
    const cur = commentsMap[postId];
    const nextVisible = !(cur?.visible);

    // set trạng thái visible ngay lập tức (toggle)
    setCommentsMap((prev) => ({ ...prev, [postId]: { ...(prev[postId] || {}), visible: nextVisible } }));

    // Chỉ fetch khi đang mở (nextVisible === true) và chưa load lần nào (cur === undefined)
    if (!nextVisible) return;

    if (cur === undefined) {
      // chưa load comments cho post này -> fetch
      setCommentsMap((prev) => ({ ...prev, [postId]: { ...(prev[postId] || {}), loading: true } }));
      try {
        const res = await api.get(`/comment/post/${postId}`);
        const items = Array.isArray(res.data) ? res.data : [];
        setCommentsMap((prev) => ({ ...prev, [postId]: { ...(prev[postId] || {}), items, loading: false, visible: true, input: "" } }));
      } catch (err) {
        console.error(err);
        setCommentsMap((prev) => ({ ...prev, [postId]: { ...(prev[postId] || {}), items: [], loading: false } }));
        message.error("Không thể tải bình luận");
      }
    }
  };

  const handleCommentChange = (postId, value) => {
    setCommentsMap((prev) => ({ ...prev, [postId]: { ...(prev[postId] || {}), input: value } }));
  };

  const submitComment = async (postId) => {
    const postComments = commentsMap[postId] || {};
    const content = (postComments.input || "").trim();
    if (!content) return;
    const authorId = user?.id ?? user?._id ?? null;
    if (!authorId) {
      message.error("Vui lòng đăng nhập để bình luận");
      return;
    }

    // optimistic UI: add local comment immediately
    const tempComment = {
      id: `tmp-${Date.now()}`,
      post_id: postId,
      author_id: authorId,
      content,
      createdAt: new Date().toISOString(),
      author: { name: user?.name ?? user?.email ?? "Bạn" },
    };

    setCommentsMap((prev) => {
      const prevItems = prev[postId]?.items || [];
      return { ...prev, [postId]: { ...(prev[postId] || {}), items: [...prevItems, tempComment], input: "" } };
    });
    setPosts((prev) => prev.map((p) => (getId(p) === postId ? { ...p, commentCount: (p.commentCount || 0) + 1 } : p)));

    try {
      const res = await api.post("/comment", { postId, authorId, content });
      console.log("Comment created:", authorId);
      const created = res.data;
      setCommentsMap((prev) => {
        const items = (prev[postId]?.items || []).map((c) => (c.id && String(c.id).startsWith("tmp-") && c.content === content ? created : c));
        if (!items.find((c) => String(c.id) === String(created.id))) items.push(created);
        return { ...prev, [postId]: { ...(prev[postId] || {}), items, input: "" } };
      });
    } catch (err) {
      console.error(err);
      message.error("Không thể gửi bình luận");
      // revert optimistic changes
      setCommentsMap((prev) => {
        const items = (prev[postId]?.items || []).filter((c) => !(String(c.id).startsWith("tmp-") && c.content === content));
        return { ...prev, [postId]: { ...(prev[postId] || {}), items } };
      });
      setPosts((prev) => prev.map((p) => (getId(p) === postId ? { ...p, commentCount: Math.max(0, (p.commentCount || 1) - 1) } : p)));
    }
  };

  const filtered = posts.filter((p) => p.post_type === tabKey);

  return (
    <div className="home-root">
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            borderBottom: "1px solid #cfc6c6ff",
          }}
        >
          <Title level={4} style={{ margin: 0 }}>
            VolunteerHub
          </Title>
          <Space>
            <Avatar icon={<UserOutlined />} />
            <Text>{user?.email}</Text>
            <Button type="primary" icon={<LogoutOutlined />} onClick={logout}>
              Logout
            </Button>
          </Space>
        </Header>

        <Layout style={{ flexDirection: "row" }}>
          <Sider
            className="home-sider"
            width={450}
            style={{
              background: "#fff",
              borderRight: "1px solid #cfc6c6ff",
              paddingTop: 16,
              height: "calc(100vh - 64px)",
              position: "sticky",
              top: 64,
              alignSelf: "flex-start",
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedMenu]}
              onClick={(e) => setSelectedMenu(e.key)}
              style={{ borderRight: 0 }}
              items={[
                {
                  key: "home",
                  icon: <HomeOutlined style={{ fontSize: 24 }} />,
                  label: <span className="menu-label">Home</span>,
                },
                {
                  key: "notification",
                  icon: <BellOutlined style={{ fontSize: 24 }} />,
                  label: <span className="menu-label">Notification</span>,
                },
              ]}
            />
          </Sider>

          <Content
            style={{
              flex: 1,
              padding: "24px 32px",
              display: "flex",
              flexDirection: "column",
              height: "calc(100vh - 64px)",
              background: "#fafafa",
            }}
          >
            <div
              style={{
                position: "sticky",
                top: 0,
                zIndex: 2,
                background: "#fafafa",
                paddingBottom: 12,
              }}
            >
              <Tabs activeKey={tabKey} onChange={(key) => setTabKey(key)} centered items={[
                { key: "discuss", label: "Discussion" },
                { key: "hiring", label: "Hiring" },
              ]} />
            </div>

            <div
              ref={containerRef}
              className="posts-scroll"
              style={{
                flex: 1,
                overflowY: "auto",
                paddingTop: 8,
              }}
            >
              {loading ? (
                <div style={{ display: "flex", justifyContent: "center", padding: 24 }}>
                  <Spin />
                </div>
              ) : filtered.length === 0 ? (
                <Empty description="Chưa có bài viết" />
              ) : (
                <List
                  dataSource={filtered}
                  renderItem={(post) => {
                    const postId = getId(post);
                    const cm = commentsMap[postId] || {};
                    const isLiked = Boolean(post.isLiked);
                    return (
                      <Card key={postId} className="fb-post-card">
                        {/* Header */}
                        <div className="fb-post-header">
                          <Avatar size={40} icon={<UserOutlined />} />
                          <div className="fb-post-header-info">
                            <Text strong className="fb-post-author">
                              {post.author?.name || "Ẩn danh"}
                            </Text>
                            <Text type="secondary" className="fb-post-time">
                              {" "}11 giờ
                            </Text>
                          </div>
                        </div>

                        {/* Nội dung */}
                        <div className="fb-post-content">
                          {post.event?.title && (
                            <Text strong style={{ display: "block", marginBottom: 4 }}>{post.event.title}</Text>
                          )}
                          <Text style={{ whiteSpace: "pre-line" }}>{post.content}</Text>
                        </div>

                        {/* Số lượng tương tác */}
                        <div className="fb-post-stats">
                          <div
                            className="fb-post-likes"
                            onClick={() => openLikes(postId)}
                            style={{ cursor: "pointer", display: "inline-block" }}
                            title="Xem ai đã thích"
                          >
                            👍 {post.likeCount || 0}
                          </div>
                          <div className="fb-post-comments">{post.commentCount || 0} bình luận</div>
                        </div>

                        {/* Thanh hành động */}
                        <div className="fb-post-actions">
                          <Button
                            type="text"
                            icon={<LikeOutlined style={{ color: isLiked ? "#1890ff" : undefined }} />}
                            onClick={() => toggleLike(post)}
                          >
                            Thích
                          </Button>
                          <Button type="text" icon={<MessageOutlined />} onClick={() => toggleComments(postId)}>Bình luận</Button>
                        </div>

                        {/* Comment section */}
                        {cm.visible && (
                          <div className="comment-section">
                            {cm.loading ? (
                              <div style={{ padding: 12, textAlign: "center" }}><Spin size="small" /></div>
                            ) : (
                              <>
                                <div className="comment-list">
                                  {(cm.items || []).length === 0 ? (
                                    <Text type="secondary">Chưa có bình luận</Text>
                                  ) : (
                                    (cm.items || []).map((c) => (
                                      <div className="comment-item" key={c.id || `${c.post_id}-${c.createdAt}`}>
                                        <Avatar size={28} icon={<UserOutlined />} />
                                        <div className="comment-body">
                                          <div className="comment-meta">
                                            <Text strong>{c.author?.name || c.author_id || "Người dùng"}</Text>
                                            <Text type="secondary" className="comment-time"> • {new Date(c.createdAt).toLocaleString()}</Text>
                                          </div>
                                          <div className="comment-content">{c.content}</div>
                                        </div>
                                      </div>
                                    ))
                                  )}
                                </div>

                                <div className="comment-input">
                                  <Input.TextArea
                                    value={cm.input || ""}
                                    onChange={(e) => handleCommentChange(postId, e.target.value)}
                                    rows={2}
                                    placeholder="Viết bình luận..."
                                  />
                                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 6 }}>
                                    <Button type="primary" size="small" onClick={() => submitComment(postId)}>
                                      Gửi
                                    </Button>
                                  </div>
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </Card>
                    );
                  }}
                />
              )}
            </div>
          </Content>

          <Sider
            width={450}
            style={{
              background: "#fff",
              borderLeft: "1px solid #cfc6c6ff",
              padding: "16px",
              height: "calc(100vh - 64px)",
              position: "sticky",
              top: 64,
              alignSelf: "flex-start",
            }}
          >
            <Input placeholder="Search..." prefix={<SearchOutlined />} allowClear style={{ borderRadius: 8 }} />
          </Sider>
        </Layout>
      </Layout>

      <Modal
        title="Người đã thích"
        open={likesModalVisible}
        onCancel={closeLikes}
        footer={null}
      >
        {likesLoading ? (
          <div style={{ textAlign: "center", padding: 16 }}><Spin /></div>
        ) : likesList.length === 0 ? (
          <Text type="secondary">Chưa có ai thích bài viết này.</Text>
        ) : (
          <List
            itemLayout="horizontal"
            dataSource={likesList}
            renderItem={(like) => {
              const u = like.user ?? like.User ?? { name: "Người dùng", role: "" };
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar icon={<UserOutlined />} />}
                    title={u.name || "Người dùng"}
                    description={u.role ? `${u.role}` : undefined}
                  />
                  <div style={{ fontSize: 12, color: "#888" }}>{new Date(like.createdAt).toLocaleString()}</div>
                </List.Item>
              );
            }}
          />
        )}
      </Modal>
    </div>
  );
};

export default Home;