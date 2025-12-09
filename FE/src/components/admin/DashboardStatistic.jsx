import { Card, Col, Row, Statistic, Button, message, Typography } from "antd";
import { DownloadOutlined, UserOutlined, FileTextOutlined, CalendarOutlined } from "@ant-design/icons";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Legend } from "recharts";
import { exportStatisticsToExcel } from "../../utils/excelExport";

const { Title, Text } = Typography;
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

const DashboardStatistic = ({ users = [], posts = [], events = [] }) => {
  const handleExportExcel = () => {
    try {
      exportStatisticsToExcel(users, posts, events);
      message.success('Đã xuất file Excel thành công!');
    } catch (error) {
      console.error(error);
      message.error('Lỗi khi xuất file Excel');
    }
  };
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

  // Thống kê sự kiện theo trạng thái duyệt
  const eventStatusCounts = {
    pending: events.filter(e => e.approvalStatus === "pending").length,
    approved: events.filter(e => e.approvalStatus === "approved").length,
    rejected: events.filter(e => e.approvalStatus === "rejected").length,
  };
  const eventStatusData = [
    { name: "Chờ duyệt", value: eventStatusCounts.pending },
    { name: "Đã duyệt", value: eventStatusCounts.approved },
    { name: "Từ chối", value: eventStatusCounts.rejected },
  ].filter(item => item.value > 0);

  // Thống kê sự kiện theo tháng (12 tháng gần nhất)
  const currentDate = new Date();
  const monthlyEventData = [];
  
  for (let i = 11; i >= 0; i--) {
    const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
    const monthName = monthDate.toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });
    
    const eventsInMonth = events.filter(event => {
      const eventDate = new Date(event.createdAt);
      return eventDate.getMonth() === monthDate.getMonth() && 
             eventDate.getFullYear() === monthDate.getFullYear();
    }).length;
    
    monthlyEventData.push({
      name: monthName,
      events: eventsInMonth
    });
  }

  // Top 5 user đăng bài nhiều nhất
  const topUsers = users.map(user => {
    const count = posts.filter(p => p.author?.id === user.id).length;
    return { name: user.name, posts: count };
  }).sort((a, b) => b.posts - a.posts).slice(0, 5);

  return (
    <div style={{ padding: 0 }}>
      {/* Header with Export Button */}
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0, marginBottom: 4 }}>📊 Thống kê tổng quan</Title>
          <Text type="secondary">Xem tổng quan về người dùng, bài viết và sự kiện</Text>
        </div>
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={handleExportExcel}
          size="large"
        >
          Xuất Excel
        </Button>
      </div>
      
      {/* Row 1: Tổng quan */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Tổng người dùng" 
              value={users.length} 
              prefix={<UserOutlined />}
              valueStyle={{ color: "#3f8600" }} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Tổng bài viết" 
              value={posts.length} 
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#FA541C" }} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Bài chờ duyệt" 
              value={postStatusCounts.pending} 
              prefix={<FileTextOutlined />}
              valueStyle={{ color: "#faad14" }} 
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Trạng thái bài viết */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Tổng sự kiện" 
              value={events.length} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#cf1322" }} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Sự kiện chờ duyệt" 
              value={events.filter((e) => e.approvalStatus == "pending").length} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#52c41a" }} 
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic 
              title="Sự kiện từ chối" 
              value={events.filter(e => e.approvalStatus === "rejected").length} 
              prefix={<CalendarOutlined />}
              valueStyle={{ color: "#f5222d" }} 
            />
          </Card>
        </Col>
      </Row>

      {/* Row 3: Biểu đồ bài viết */}
      <Row gutter={16} style={{ marginBottom: 20 }}>
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

      {/* Row 4: Biểu đồ sự kiện */}
      <Row gutter={16}>
        <Col span={12}>
          <Card title="Sự kiện theo trạng thái duyệt">
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie 
                  data={eventStatusData} 
                  dataKey="value" 
                  nameKey="name" 
                  outerRadius={80} 
                  label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                >
                  {eventStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>

        <Col span={12}>
          <Card title="Số sự kiện theo tháng (12 tháng gần nhất)">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={monthlyEventData} margin={{ top: 20, right: 20, bottom: 20, left: 0 }}>
                <XAxis dataKey="name" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Bar dataKey="events" fill="#FA541C" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default DashboardStatistic;
