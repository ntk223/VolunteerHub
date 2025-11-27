import React from "react";
import { Button, Result, Typography, Space } from "antd";
import { 
  ReloadOutlined, 
  HomeOutlined, 
  HeartTwoTone, 
  ApiOutlined 
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// Bạn có thể import logo của bạn ở đây
import AppLogo from "../../assets/AppLogo.png"; // Thay đổi đường dẫn theo cấu trúc dự án của bạn

const { Paragraph, Text, Title } = Typography;

const ServerErrorPage = () => {
  const navigate = useNavigate();

  // --- LOGIC RELOAD (GIỮ NGUYÊN) ---
  const handleReload = () => {
    const back = new URLSearchParams(window.location.search).get("backUrl");
    if (back) {
      navigate(decodeURIComponent(back));
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        // Nền Gradient nhẹ nhàng (Xanh trời pha chút xanh lá) -> Tạo cảm giác bình tĩnh
        background: "linear-gradient(135deg, #e6f7ff 0%, #f6ffed 100%)", 
        padding: "20px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div
        style={{
          position: "relative",
          background: "rgba(255, 255, 255, 0.9)", // Nền trắng mờ
          backdropFilter: "blur(10px)", // Hiệu ứng kính
          padding: "50px 40px",
          borderRadius: "24px",
          boxShadow: "0 10px 40px rgba(0,0,0,0.08)",
          maxWidth: "550px",
          width: "100%",
          textAlign: "center",
          border: "1px solid #fff",
        }}
      >
        {/* --- 1. KHU VỰC LOGO TRÒN --- */}
        <div
          style={{
            position: "absolute",
            top: "-40px",
            left: "50%",
            transform: "translateX(-50%)",
            width: "80px",
            height: "80px",
            background: "#fff",
            borderRadius: "50%",
            padding: "5px",
            boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Thay src bằng biến import logo của bạn */}
          <img
            src={AppLogo} 
            alt="Logo"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              borderRadius: "50%",
            }}
          />
        </div>

        {/* --- 2. NỘI DUNG CHÍNH --- */}
        <div style={{ marginTop: 20 }}>
          <Result
            // Thay icon mặc định bằng Icon Trái tim + Kết nối
            icon={
                <div style={{ position: 'relative', display: 'inline-block' }}>
                    <HeartTwoTone twoToneColor="#ff4d4f" style={{ fontSize: 80 }} />
                    <div style={{ 
                        position: 'absolute', 
                        bottom: -5, 
                        right: -10, 
                        background: '#fff', 
                        borderRadius: '50%', 
                        padding: 5 
                    }}>
                        <ApiOutlined style={{ fontSize: 30, color: '#1677ff' }} />
                    </div>
                </div>
            }
            title={
                <Title level={3} style={{ color: "#1e293b", margin: "10px 0" }}>
                    Kết nối đang được chữa lành
                </Title>
            }
            subTitle={
              <div style={{ fontSize: 16 }}>
                <Text style={{ color: "#64748b" }}>
                  Hệ thống đang gặp chút sự cố gián đoạn. <br/>
                  Đội ngũ tình nguyện viên kỹ thuật đang nỗ lực khắc phục.
                </Text>
                
                <div 
                    style={{ 
                        marginTop: 20, 
                        padding: "15px", 
                        background: "#fffbe6", 
                        border: "1px dashed #ffe58f", 
                        borderRadius: "8px",
                        color: "#d48806",
                        fontSize: 14
                    }}
                >
                    "Một hành động nhỏ, một ý nghĩa lớn. <br/>Cảm ơn bạn đã kiên nhẫn cùng chúng tôi."
                </div>
              </div>
            }
            extra={
              <Space size="middle" style={{ marginTop: 20 }}>
                <Button
                  key="reload"
                  type="primary"
                  icon={<ReloadOutlined />}
                  size="large"
                  shape="round" // Nút bo tròn thân thiện hơn
                  onClick={handleReload}
                  style={{ 
                    height: 45, 
                    paddingLeft: 30, 
                    paddingRight: 30,
                    background: "linear-gradient(45deg, #1677ff, #4096ff)",
                    border: "none",
                    boxShadow: "0 4px 10px rgba(22, 119, 255, 0.3)"
                  }}
                >
                  Thử lại ngay
                </Button>
                
                <Button
                  key="home"
                  size="large"
                  shape="round"
                  icon={<HomeOutlined />}
                  onClick={() => navigate("/landing")}
                  style={{ height: 45 }}
                >
                  Về trang chủ
                </Button>
              </Space>
            }
          />
        </div>
      </div>

      {/* Footer nhỏ trang trí */}
      <div 
        style={{ 
            position: 'absolute', 
            bottom: 20, 
            color: '#8c8c8c', 
            fontSize: 12,
            opacity: 0.7 
        }}
      >
        VolunteerHub - Connecting Hearts
      </div>
    </div>
  );
};

export default ServerErrorPage;