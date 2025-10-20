import "./Home.css";
import { useState, useEffect, useRef } from "react";
import Cookies from "js-cookie";
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
  const [selectedMenu, setSelectedMenu] = useState("home");
  const [tabKey, setTabKey] = useState("discuss");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        const token = Cookies.get("access_token");
        if (!token) {
          message.error("Không tìm thấy token, vui lòng đăng nhập lại");
          logout();
          return;
        }

        const res = await fetch("http://localhost:5000/api/post/discuss", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          if (res.status === 401) {
            message.error("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại");
            logout();
          } else {
            message.error("Không thể tải danh sách bài viết");
          }
          setPosts([]);
          return;
        }

        const data = await res.json();
        setPosts(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error(err);
        message.error("Lỗi khi tải bài viết");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logout]);

  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, likeCount: (p.likeCount || 0) + 1 } : p))
    );
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
              <Tabs
                activeKey={tabKey}
                onChange={(key) => setTabKey(key)}
                centered
                items={[
                  { key: "discuss", label: "Discussion" },
                  { key: "hiring", label: "Hiring" },
                ]}
              />
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
                  renderItem={(post) => (
                    <Card key={post.id} className="fb-post-card">
                      {/* Header */}
                      <div className="fb-post-header">
                        <Avatar size={40} icon={<UserOutlined />} />
                        <div className="fb-post-header-info">
                          <Text strong className="fb-post-author">{post.author?.name || "Ẩn danh"}</Text>
                          <Text type="secondary" className="fb-post-time"> 11 giờ</Text>
                        </div>
                      </div>

                      {/* Nội dung */}
                      <div className="fb-post-content">
                        {post.event?.title && (
                          <Text strong style={{ display: "block", marginBottom: 4 }}>
                            {post.event.title}
                          </Text>
                        )}
                        <Text style={{ whiteSpace: "pre-line" }}>{post.content}</Text>
                      </div>

                      {/* Số lượng tương tác */}
                      <div className="fb-post-stats">
                        <div className="fb-post-likes">
                          👍 {post.likeCount || 0}
                        </div>
                        <div className="fb-post-comments">
                          {post.commentCount || 0} bình luận
                        </div>
                      </div>

                      {/* Thanh hành động */}
                      <div className="fb-post-actions">
                        <Button type="text" icon={<LikeOutlined />} onClick={() => handleLike(post.id || post._id)}>
                          Thích
                        </Button>
                        <Button type="text" icon={<MessageOutlined />}>
                          Bình luận
                        </Button>
                      </div>
                    </Card>
                  )}
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
            <Input
              placeholder="Search..."
              prefix={<SearchOutlined />}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Sider>
        </Layout>
      </Layout>
    </div>
  );
};

export default Home;