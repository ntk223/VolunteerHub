import { useState } from 'react';
import { Card, Form, Button, Row, Col, theme } from 'antd'; // 1. Import theme
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import UpdateProfileForm from '../../components/auth/Profile/UpdateProfileForm';
import ChangePasswordForm from '../../components/auth/Profile/ChangePasswordForm';
import AvatarCard from '../../components/auth/Profile/AvatarCard';
import Statistics from '../../components/auth/Profile/Statistics';
import Activities from '../../components/auth/Profile/Activities';
import EventCompleted from '../../components/auth/Profile/EventCompleted';
import PushNotificationToggle from '../../components/notification/PushNotificationToggle';
import { useLocation } from 'react-router-dom';

const MyProfile = () => {
  const location = useLocation();
  const { user, updateUser } = useAuth();
  
  // 2. Sử dụng hook useToken để lấy các biến màu (token)
  const { token } = theme.useToken();

  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

  return (
    <div
      style={{
        // 3. Thay màu cứng '#f5f6fa' bằng token.colorBgLayout
        background: token.colorBgLayout, 
        minHeight: '100vh',
        padding: '40px 0',
        display: 'flex',
        justifyContent: 'center',
        color: token.colorText, // Đảm bảo màu chữ chính xác
      }}
    >
      <div style={{ width: '100%', maxWidth: 1200 }}>
        <Row gutter={[24, 24]}>
          {/* Hàng 1 */}
          <Col xs={24} md={12}>
            <AvatarCard user={user} updateUser={updateUser} isMe={true} />
          </Col>

          <Col xs={24} md={12}>
            <Statistics userId={user.id} location={location} />
          </Col>

          {/* Hàng 2 */}
          <Col xs={24} md={12}>
            <Card
              title="Thông tin cá nhân"
              style={{
                borderRadius: token.borderRadiusLG, // Dùng token bo góc chuẩn của Antd
                // 4. Xử lý Shadow: Dark mode thường ít dùng shadow nổi hơn Light mode
                boxShadow: token.boxShadowTertiary, 
                height: '100%',
                // Card của Antd tự động xử lý background (trắng hoặc đen), không cần set thủ công
              }}
              extra={
                isEditing ? (
                  <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => profileForm.submit()}
                  >
                    Lưu
                  </Button>
                ) : (
                  <Button
                    icon={<EditOutlined />}
                    onClick={() => {
                      setIsEditing(true);
                      profileForm.setFieldsValue({
                        name: user?.name,
                        introduce: user?.introduce,
                      });
                    }}
                  >
                    Chỉnh sửa
                  </Button>
                )
              }
            >
              <UpdateProfileForm
                profileForm={profileForm}
                user={user}
                updateUser={updateUser}
                setIsEditing={setIsEditing}
                isEditing={isEditing}
              />

              <Button
                type="primary" // Hoặc 'default' tùy thiết kế
                // ghost // Thêm thuộc tính ghost nếu muốn nút trong suốt trên nền tối
                onClick={() => setIsChangePasswordVisible(true)}
                style={{
                  marginTop: isEditing ? 16 : 0,
                }}
              >
                Đổi mật khẩu
              </Button>
            </Card>
          </Col>

          {user.role !== 'admin' && 
          (<Col xs={24} md={12}>
            {user?.role === 'manager' ? (
              <EventCompleted userId={user.id} />
            ) : (
              <Activities volunteerId={user.volunteer.id} />
            )}
          </Col>)}

          {/* Push Notification Settings */}
          <Col xs={24}>
            <PushNotificationToggle />
          </Col>
        </Row>

        {/* Modal đổi mật khẩu */}
        <ChangePasswordForm 
          form={form} 
          isChangePasswordVisible={isChangePasswordVisible} 
          setIsChangePasswordVisible={setIsChangePasswordVisible} 
        />
      </div>
    </div>
  );
};

export default MyProfile;