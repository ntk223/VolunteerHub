import { useState } from 'react';
import { Card, Avatar, Upload, message, Spin, Typography } from 'antd';
import { UserOutlined, CameraOutlined, LoadingOutlined } from '@ant-design/icons';
import api from '../../../api/index.js';
const { Title } = Typography;

const AvatarCard = ({ user, updateUser }) => {
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
        <Card>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setIsHovering(true)}
                onMouseLeave={() => setIsHovering(false)}
              >
                {/* Avatar */}
                <Avatar
                  size={120}
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
                      height: '85%',
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
                        height: '87%',
                        background: 'rgba(0, 0, 0, 0.5)',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        cursor: 'pointer',
                        borderRadius: '50%'
                      }}
                    >
                      <CameraOutlined style={{ fontSize: '24px', color: '#fff' }} />
                    </div>
                  </Upload>
                )}
              </div>

              <Title level={4} style={{ marginTop: 16 }}>{user?.name}</Title>
              <p style={{ color: '#666' }}>{translateRole(user?.role)}</p>
            </div>
          </Card>
    )
}

export default AvatarCard;