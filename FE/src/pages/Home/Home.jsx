import "./Home.css";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"; // ✅ Thêm dòng này
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

  // Lấy dữ liệu từ API backend
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        // Lấy token từ cookie
        const token = Cookies.get("access_token");

        if (!token) {
          message.error("Không tìm thấy token, vui lòng đăng nhập lại");
          return;
        }

        // Gửi kèm token trong header Authorization
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
          }
          throw new Error("Failed to fetch posts");
        }

        const data = await res.json();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (err) {
        console.error(err);
        message.error("Không thể tải danh sách bài viết");
      }
    };

    fetchPosts();
  }, [logout]);

  // Xử lý like (frontend tạm thời)
  const handleLike = (id) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, likeCount: p.likeCount + 1 } : p
      )
    );
  };

  return (
    <div className="home-root">
      <Layout style={{ minHeight: "100vh", background: "#f5f7fa" }}>
        {/* Header */}
        <Header
          style={{
            background: "#fff",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 24px",
            borderBottom: "1px solid #eee",
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

        {/* Body Layout */}
        <Layout style={{ flexDirection: "row" }}>
          {/* Left Sidebar */}
          <Sider
            width={220}
            style={{
              background: "#fff",
              borderRight: "1px solid #eee",
              paddingTop: 16,
              height: "calc(100vh - 64px)",
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[selectedMenu]}
              onClick={(e) => setSelectedMenu(e.key)}
              style={{ borderRight: 0 }}
              items={[
                { key: "home", icon: <HomeOutlined />, label: "Home" },
                { key: "notification", icon: <BellOutlined />, label: "Notification" },
              ]}
            />
          </Sider>

          {/* Main Feed */}
          <Content
            style={{
              flex: 1,
              padding: "24px 32px",
              overflowY: "auto",
              height: "calc(100vh - 64px)",
              background: "#fafafa",
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

            <List
              dataSource={posts.filter((p) => p.post_type === tabKey)}
              renderItem={(post) => (
                <Card key={post.id} style={{ marginBottom: 16 }}>
                  {/* Người đăng */}
                  <Space align="center" style={{ marginBottom: 8 }}>
                    <Avatar icon={<UserOutlined />} />
                    <Text strong>{post.author?.name || "Ẩn danh"}</Text>
                  </Space>

                  {/* Tiêu đề sự kiện (nếu có) */}
                  {post.event?.title && (
                    <Text type="secondary" style={{ display: "block", marginBottom: 4 }}>
                       {post.event.title}
                    </Text>
                  )}

                  {/* Nội dung bài viết */}
                  <Text style={{ display: "block", marginBottom: 12 }}>
                    {post.content}
                  </Text>

                  {/* Nút Like & Comment */}
                  <Space>
                    <Button
                      type="text"
                      icon={<LikeOutlined />}
                      onClick={() => handleLike(post.id)}
                    >
                      {post.likeCount}
                    </Button>
                    <Button type="text" icon={<MessageOutlined />}>
                      {post.commentCount}
                    </Button>
                  </Space>
                </Card>
              )}
            />
          </Content>

          {/* Right Sidebar */}
          <Sider
            width={260}
            style={{
              background: "#fff",
              borderLeft: "1px solid #eee",
              padding: "16px",
              height: "calc(100vh - 64px)",
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
