import { useState } from 'react';
import { Card, Avatar, Upload, message, Spin, Typography } from 'antd';
import { UserOutlined, CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import api from '../../../api/index.js';
const { Title, Text } = Typography;

const AvatarCard = ({ user, updateUser, isMe }) => {
  const [isHovering, setIsHovering] = useState(false);
  const [loading, setLoading] = useState(false);

  const translateRole = (role) => {
    const roleMap = {
        'volunteer': 'Tình nguyện viên',
        'manager': 'Quản lý',
        'admin': 'Quản trị viên'
    };
        return roleMap[role?.toLowerCase()] || role;
    };
  const handleAvatarUpload = async (file) => {
    try {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('userId', user.id);

        const response = await api.post("/file/upload", formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (response.data) {
            const avatarUrl = response.data.file.url;
            await api.put(`/user/${user.id}`, { avatarUrl });
            updateUser({ ...user, avatarUrl });
            message.success('Cập nhật ảnh đại diện thành công');
        }
        } catch (error) {
            console.error(error);
            message.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
        } finally {
            setLoading(false);
        }
    };
    return (
        <Card style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                textAlign: 'center',
                height: '100%',
              }}>
              <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setIsHovering(isMe ? true : false)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Avatar */}
                <Avatar
                  size={250}
                  icon={!user?.avatarUrl && <UserOutlined />}
                  src={user?.avatarUrl}
                  style={{ marginBottom: '16px' }}
                />

                {/* Loading overlay */}
                {loading && (
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '94%',
                      background: 'rgba(0, 0, 0, 0.5)',
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      borderRadius: '50%'
                    }}
                  >
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 28, color: '#fff' }} spin />} />
                  </div>
                )}

                {/* Hover overlay */}
                {!loading && isHovering && (
                  <Upload
                    accept="image/*"
                    showUploadList={false}
                    beforeUpload={(file) => {
                      if (file.size > 2 * 1024 * 1024) {
                        message.error('Kích thước ảnh không được vượt quá 2MB');
                        return Upload.LIST_IGNORE;
                      }
                      handleAvatarUpload(file);
                      return Upload.LIST_IGNORE;
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '94%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderRadius: '50%'
                      }}
                    >
                      <CameraOutlined style={{ fontSize: '44px', color: '#fff' }} />
                    </div>
                  </Upload>
                )}
              </div>

            <Title
              level={1}
              style={{
                marginTop: 16,
                marginBottom: 0,
                fontWeight: 700,
                letterSpacing: '0.5px',
              }}
            >
              {user?.name}
            </Title>
            <Text style={{ fontSize: '17px', color: '#555' }}>
              {translateRole(user?.role)}
            </Text>

          </Card>
    )
}

export default AvatarCard;