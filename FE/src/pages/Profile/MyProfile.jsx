import { useState } from 'react';
import {Card, Form, Button, Row, Col} from 'antd';
import { EditOutlined, SaveOutlined } from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import UpdateProfileForm from '../../components/auth/Profile/UpdateProfileForm';
import ChangePasswordForm from '../../components/auth/Profile/ChangePasswordForm';
import AvatarCard from '../../components/auth/Profile/AvatarCard';
import Statistics from '../../components/auth/Profile/Statistics';
import Activities from '../../components/auth/Profile/Activities';
import { useLocation } from 'react-router-dom';

import api from '../../api';
import { useEffect } from 'react';
const MyProfile = () => {
  const location = useLocation();

  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();
  const [isChangePasswordVisible, setIsChangePasswordVisible] = useState(false);

  return (
    <div
      style={{
        background: '#f5f6fa',
        minHeight: '100vh',
        padding: '40px 0',
        display: 'flex',
        justifyContent: 'center',
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
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%',
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
                type="primary"
                onClick={() => setIsChangePasswordVisible(true)}
                style={{
                  marginTop: isEditing ? 16 : 0,
                }}
              >
                Đổi mật khẩu
              </Button>
            </Card>
          </Col>

          <Col xs={24} md={12}>
            <Activities />
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
