import { Card, Col, Row, Statistic } from "antd";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardStatistic = ({ users = [], posts = [], events = [] }) => {
  // Thống kê bài viết theo trạng thái
  const postStatusCounts = {
    pending: posts.filter(p => p.status === "pending").length,
    approved: posts.filter(p => p.status === "approved").length,
    rejected: posts.filter(p => p.status === "rejected").length,
  };

  // Thống kê bài viết theo loại
  const postTypeCounts = posts.reduce((acc, p) => {
    acc[p.postType] = (acc[p.postType] || 0) + 1;
    return acc;
  }, {});
  const postTypeData = Object.keys(postTypeCounts).map(key => ({ name: key, value: postTypeCounts[key] }));

  // Top 5 user đăng bài nhiều nhất
  const topUsers = users.map(user => {
    const count = posts.filter(p => p.author?.id === user.id).length;
    return { name: user.name, posts: count };
  }).sort((a, b) => b.posts - a.posts).slice(0, 5);

  return (
    <div style={{ padding: "20px" }}>
      {/* Row 1: Tổng quan */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng người dùng" value={users.length} valueStyle={{ color: "#3f8600" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng bài viết" value={posts.length} valueStyle={{ color: "#1890ff" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Tổng sự kiện" value={events.length} valueStyle={{ color: "#cf1322" }} />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Trạng thái bài viết */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic title="Bài chờ duyệt" value={postStatusCounts.pending} valueStyle={{ color: "#faad14" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Bài đã duyệt" value={postStatusCounts.approved} valueStyle={{ color: "#52c41a" }} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="Bài từ chối" value={postStatusCounts.rejected} valueStyle={{ color: "#f5222d" }} />
          </Card>
        </Col>
      </Row>

      {/* Row 3: Biểu đồ */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Bài viết theo loại">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={postTypeData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {postTypeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Top 5 người dùng đăng nhiều bài nhất">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={topUsers} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="posts" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStatistic;
