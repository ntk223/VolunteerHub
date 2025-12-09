import { Button } from "antd";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
const UnauthorizePage = () => {
    const navigate = useNavigate();
    const [count, setCount] = useState(5);
  // 2. Setup hiệu ứng đếm ngược
  useEffect(() => {
      const timer = setInterval(() => {
        setCount((prevCount) => {
          if (prevCount === 1) {
            clearInterval(timer);
            navigate("/");
          }
          return prevCount - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    
  }, [ navigate]);
    return (
    <div 
        className="admin-page admin-denied" 
        style={{ 
            textAlign: 'center', 
            padding: '50px', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            gap: '15px'
        }}
      >
        <h2 style={{ color: '#ff4d4f' }}>⛔ Quyền truy cập bị từ chối</h2>
        <p style={{ fontSize: '16px' }}>Bạn không có quyền vào trang quản trị.</p>
        
        {/* Hiển thị đếm ngược */}
        <p style={{ color: '#8c8c8c' }}>
          Tự động quay về trang chủ sau <span style={{ fontWeight: 'bold', color: '#FA541C' }}>{count}</span> giây...
        </p>

        {/* Nút bấm để về ngay lập tức */}
        <Button type="primary" onClick={() => navigate("/")}>
          Về trang chủ ngay
        </Button>
      </div>
    )
}

export default UnauthorizePage;