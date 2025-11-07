import { useState } from 'react';
import { Card, Form, Button, Row, Col} from 'antd';
import { EditOutlined, SaveOutlined} from '@ant-design/icons';
import { useAuth } from '../../hooks/useAuth';
import UpdateProfileForm from '../../components/auth/Profile/UpdateProfileForm';
import ChangePasswordForm from '../../components/auth/Profile/ChangePasswordForm';
import AvatarCard from '../../components/auth/Profile/AvatarCard';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const [profileForm] = Form.useForm();


  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
            <AvatarCard user={user} updateUser={updateUser} />
        </Col>

        <Col xs={24} md={16}>
          <Card
            title="Thông tin cá nhân"
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
                      introduce: user?.introduce
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
              style={{ marginTop: isEditing ? 16 : 0 }}
            >
              Đổi mật khẩu
            </Button>
          </Card>
        </Col>
      </Row>

      <ChangePasswordForm form={form} />
    </div>
  );
};

export default Profile;
