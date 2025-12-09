import React from "react";
import { Layout, Typography, Button, Row, Col, Card, Space, Divider } from "antd";
import {
  RocketOutlined,
  HeartOutlined,
  TeamOutlined,
  ScheduleOutlined,
  SafetyCertificateOutlined,
  ArrowRightOutlined,
  CheckCircleFilled,
  GithubOutlined,
  LinkedinOutlined,
  FacebookOutlined,
  EnvironmentOutlined,
  GlobalOutlined,
  UserOutlined
} from "@ant-design/icons";
import { useNavigate, Link } from "react-router-dom";
import UETLogo from "../../assets/UETLogo.png";
import AppLogo from "../../assets/AppLogo.png";
import "./LandingPage.css";

const { Content, Footer, Header } = Layout;
const { Title, Paragraph, Text } = Typography;

const LandingPage = () => {
  const navigate = useNavigate();

  // Dữ liệu tính năng
  const features = [
    {
      icon: <ScheduleOutlined style={{ fontSize: 40, color: "#FA541C" }} />,
      title: "Quản lý Sự kiện",
      desc: "Tạo, duyệt và tham gia các hoạt động tình nguyện với lịch trình chi tiết và hệ thống điểm danh QR Code.",
    },
    {
      icon: <TeamOutlined style={{ fontSize: 40, color: "#52c41a" }} />,
      title: "Kết nối Cộng đồng",
      desc: "Mạng xã hội thu nhỏ cho tình nguyện viên: Thảo luận, chia sẻ ảnh và tìm kiếm đồng đội cùng chí hướng.",
    },
    {
      icon: <SafetyCertificateOutlined style={{ fontSize: 40, color: "#faad14" }} />,
      title: "Xác thực Uy tín",
      desc: "Hệ thống đánh giá minh bạch dành cho cả Tổ chức và Tình nguyện viên, đảm bảo môi trường an toàn.",
    },
  ];

  // Quy trình hoạt động
  const steps = [
    { title: "Đăng ký", desc: "Tạo tài khoản miễn phí chỉ trong 1 phút" },
    { title: "Tìm kiếm", desc: "Lọc sự kiện theo địa điểm & sở thích" },
    { title: "Tham gia", desc: "Đăng ký tham gia và chờ duyệt" },
    { title: "Cống hiến", desc: "Tham gia hoạt động và nhận chứng nhận" },
  ];

  return (
    <Layout className="landing-container">
      {/* === 1. HEADER === */}
      <Header className="landing-header">
        <div className="header-logo" onClick={() => window.scrollTo(0,0)}>
          <img src={AppLogo} alt="VolunteerHub Logo" style={{ height: 40, marginRight: 8 }} />
          VolunteerHub
        </div>
        <Space>
          <Button type="text" onClick={() => navigate("/auth/login")}>Đăng nhập</Button>
          <Button type="primary" shape="round" onClick={() => navigate("/auth/register")}>
            Đăng ký ngay
          </Button>
        </Space>
      </Header>

      <Content>
        {/* === 2. HERO SECTION === */}
        <div className="hero-section">
          <Row gutter={[48, 48]} align="middle" style={{ maxWidth: 1200, margin: "0 auto" }}>
            {/* Text Column */}
            <Col xs={24} md={12}>
              <div style={{ display: 'inline-flex', alignItems: 'center', background: '#e6f4ff', padding: '8px 16px', borderRadius: 20, color: '#0958d9', fontWeight: 600, marginBottom: 24 }}>
                <RocketOutlined style={{ marginRight: 8 }} /> Nền tảng Tình nguyện số 1
              </div>
              <Title className="hero-title">
                Kết nối Trái tim <br />
                <span style={{ color: '#FA541C' }}>Lan tỏa Yêu thương</span>
              </Title>
              <Paragraph className="hero-subtitle">
                VolunteerHub không chỉ là nơi tìm kiếm sự kiện, mà là nơi bạn kiến tạo giá trị, 
                gặp gỡ những người bạn cùng tần số và thay đổi cộng đồng.
              </Paragraph>
              <Space size="middle">
                <Button
                  type="primary"
                  size="large"
                  shape="round"
                  style={{ height: 56, padding: "0 40px", fontSize: 18 }}
                  onClick={() => navigate("/auth/login")}
                  icon={<HeartOutlined />}
                >
                  Tham gia ngay
                </Button>
                <Button size="large" shape="round" style={{ height: 56, fontSize: 18 }}>
                  <a href="#features">Tìm hiểu thêm</a>
                </Button>
              </Space>
              
              <div style={{ marginTop: 40, display: 'flex', gap: 20 }}>
                 <div><Title level={3} style={{margin:0}}>10k+</Title><Text type="secondary">Tình nguyện viên</Text></div>
                 <Divider type="vertical" style={{height: 40}} />
                 <div><Title level={3} style={{margin:0}}>500+</Title><Text type="secondary">Sự kiện</Text></div>
              </div>
            </Col>

            {/* Image/Illustration Column */}
            <Col xs={24} md={12} className="hero-image-container">
               {/* Giả lập hình ảnh bằng các khối shape và icon để không phụ thuộc file ảnh ngoài */}
               <div style={{ 
                   position: 'relative', 
                   width: '100%', 
                   height: 400, 
                   background: 'linear-gradient(135deg, #e6f7ff 0%, #fff 100%)', 
                   borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                   display: 'flex',
                   alignItems: 'center',
                   justifyContent: 'center'
               }}>
                  <HeartOutlined style={{ fontSize: 150, color: 'rgba(252, 10, 10, 0.2)' }} />
                  
                  {/* Floating Card 1 */}
                  <div className="floating-card" style={{ top: 40, left: 20 }}>
                     <Space><CheckCircleFilled style={{color: '#52c41a'}} /> <Text strong>Đã tham gia dọn rác bãi biển</Text></Space>
                  </div>
                   {/* Floating Card 2 */}
                   <div className="floating-card" style={{ bottom: 60, right: 0, animationDelay: '1.5s' }}>
                     <Space><TeamOutlined style={{color: '#FA541C'}} /> <Text strong>Kết nối 500+ bạn mới</Text></Space>
                  </div>
               </div>
            </Col>
          </Row>
        </div>

        {/* === 3. FEATURES SECTION === */}
        <div style={{ padding: "100px 24px" }} id="features">
          <div className="section-title-container">
            <Text type="secondary" strong style={{textTransform: 'uppercase', letterSpacing: 1}}>Tính năng nổi bật</Text>
            <Title level={2}>Mọi thứ bạn cần để tạo ra tác động</Title>
            <Paragraph style={{fontSize: 16}}>Hệ thống tích hợp đầy đủ các công cụ quản lý và kết nối mạnh mẽ nhất.</Paragraph>
          </div>

          <Row gutter={[32, 32]} justify="center" style={{ maxWidth: 1200, margin: "0 auto" }}>
            {features.map((item, index) => (
              <Col xs={24} sm={12} md={8} key={index}>
                <Card className="feature-card" variant={false}>
                  <div style={{ marginBottom: 24 }}>{item.icon}</div>
                  <Title level={4}>{item.title}</Title>
                  <Paragraph style={{color: '#64748b'}}>{item.desc}</Paragraph>
                </Card>
              </Col>
            ))}
          </Row>
        </div>

        {/* === 4. HOW IT WORKS (NEW) === */}
        <div className="workflow-section">
          <div className="section-title-container">
            <Title level={2}>Quy trình hoạt động</Title>
            <Paragraph>Bắt đầu hành trình thiện nguyện của bạn thật đơn giản</Paragraph>
          </div>
          <Row gutter={[32, 32]} style={{ maxWidth: 1000, margin: "0 auto" }}>
            {steps.map((step, idx) => (
              <Col xs={12} md={6} key={idx}>
                <div className="step-card">
                   <div className="step-number">{idx + 1}</div>
                   <Title level={5}>{step.title}</Title>
                   <Text type="secondary">{step.desc}</Text>
                </div>
              </Col>
            ))}
          </Row>
        </div>

        {/* === 5. CTA SECTION === */}
        <div style={{ padding: "100px 24px", textAlign: "center", background: '#fff' }}>
          <Title level={2} style={{ marginBottom: 24 }}>
            Đừng chờ đợi điều kỳ diệu, hãy là điều kỳ diệu
          </Title>
          <Paragraph style={{ fontSize: 18, marginBottom: 40, maxWidth: 600, margin: "0 auto 40px", color: '#64748b' }}>
            Tham gia cùng hơn 10,000 tình nguyện viên đang hoạt động tích cực trên VolunteerHub ngay hôm nay.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<ArrowRightOutlined />}
            style={{ height: 56, padding: "0 50px", fontSize: 20 }}
            onClick={() => navigate("/auth/register")}
          >
            Tạo tài khoản miễn phí
          </Button>
        </div>
      </Content>

      {/* === 6. DETAILED FOOTER === */}
      <Footer className="custom-footer">
        <Row gutter={[48, 48]} style={{ maxWidth: 1200, margin: "0 auto" }}>
          
          {/* Cột 1: Thông tin chung */}
          <Col xs={24} md={8}>
            <div style={{ fontSize: 24, fontWeight: 'bold', color: '#fff', marginBottom: 16 }}>VolunteerHub</div>
            <Paragraph style={{ color: '#94a3b8' }}>
              Nền tảng kết nối tình nguyện phi lợi nhuận hàng đầu. Sứ mệnh của chúng tôi là làm cho việc làm việc thiện trở nên dễ dàng, minh bạch và hiệu quả hơn.
            </Paragraph>
            <Space style={{ marginTop: 20 }}>
               <FacebookOutlined className="social-icon" />
               <LinkedinOutlined className="social-icon" />
               <a href="https://github.com/ntk223/VolunteerHub" target="_blank" rel="noopener noreferrer">
                    <GithubOutlined className="social-icon" />
               </a>
               <GlobalOutlined className="social-icon" />
            </Space>
          </Col>

          {/* Cột 2: Liên kết nhanh */}
          <Col xs={24} sm={12} md={5}>
            <div className="footer-title">Khám phá</div>
            <a className="footer-link">Về chúng tôi</a>
            <a className="footer-link">Tìm sự kiện</a>
            <a className="footer-link">Tin tức cộng đồng</a>
            <a className="footer-link">Đối tác & Tài trợ</a>
            <a className="footer-link">Câu chuyện thành công</a>
          </Col>

          {/* Cột 3: Chính sách */}
          <Col xs={24} sm={12} md={5}>
            <div className="footer-title">Hỗ trợ</div>
            <a className="footer-link">Trung tâm trợ giúp</a>
            <a className="footer-link">Điều khoản sử dụng</a>
            <a className="footer-link">Chính sách bảo mật</a>
            <a className="footer-link">Quy tắc cộng đồng</a>
          </Col>

          {/* Cột 4: LIÊN HỆ NHÀ PHÁT TRIỂN (Yêu cầu của bạn) */}
          <Col xs={24} md={6}>
            <div className="footer-title">Liên hệ Nhà phát triển</div>
            <div className="contact-item">
               <UserOutlined style={{ color: '#FA541C' }} /> 
               <span style={{ fontWeight: 600 }}>Nguyễn Trung Kiên</span>
            </div>
                        <div className="contact-item">
               <UserOutlined style={{ color: '#FA541C' }} /> 
               <span style={{ fontWeight: 600 }}>Nguyễn Khánh Tùng</span>
            </div>
                        <div className="contact-item">
               <UserOutlined style={{ color: '#FA541C' }} /> 
               <span style={{ fontWeight: 600 }}>Trần Lê Cương</span>
            </div>
            <div className="contact-item">
               <EnvironmentOutlined style={{ color: '#FA541C' }} /> 
               <a href="https://www.facebook.com/UET.VNUH" target="_blank" rel="noopener noreferrer">
               <span style={{ color: '#94a3b8', fontWeight: 600 }}>University of Engineering and Technology</span>
               </a>
            </div>
          </Col>
        </Row>
        
        <Divider style={{ borderColor: '#334155' }} />
        

<Divider style={{ borderColor: '#334155' }} />

<div
  style={{
    textAlign: 'center',
    color: '#64748b',
    // Thêm flex để căn giữa icon và chữ theo chiều dọc dễ dàng hơn
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8, // Khoảng cách giữa các phần tử
  }}
>
  <span>
    VolunteerHub ©{new Date().getFullYear()}. All rights reserved. Created with ❤️ by UETers.
  </span>
  
  {/* Thẻ ảnh Logo UET */}
  <img
    src={UETLogo}
    alt="UET Logo"
    style={{
      width: 24,       // Kích thước nhỏ (khoảng 24px là vừa đẹp với dòng text)
      height: 24,      // Chiều cao bằng chiều rộng
      borderRadius: '50%', // Biến ảnh thành hình tròn
      objectFit: 'contain', // Đảm bảo logo không bị méo
      backgroundColor: '#fff', // Nền trắng để logo nổi bật (nếu footer tối màu)
      border: '1px solid #e2e8f0' // Viền mỏng nhẹ cho đẹp hơn (tuỳ chọn)
    }}
  />
</div>
      </Footer>
    </Layout>
  );
};

export default LandingPage;