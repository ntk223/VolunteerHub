import { useState, useEffect, use } from 'react';
import { Card, Form, Row, Col, Spin, message } from 'antd';
import UpdateProfileForm from '../../components/auth/Profile/UpdateProfileForm';
import AvatarCard from '../../components/auth/Profile/AvatarCard';
import api from '../../api';
import { useParams, useNavigate} from "react-router-dom";
import { useAuth } from '../../hooks/useAuth';

const OtherProfile = () => {
  const { id } = useParams();
  const { user: me } = useAuth();
  const navigate = useNavigate();

  const [profileForm] = Form.useForm();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (me?.id == id) {
      navigate('/profile');
    }
    const fetchUser = async () => {
      try {
        const response = await api.get(`/user/profile/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        message.error("Không thể tải thông tin người dùng");
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [me, id, navigate]);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', marginTop: 100 }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return <p style={{ textAlign: 'center' }}>Không tìm thấy người dùng.</p>;
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <AvatarCard user={user} updateUser={() => {}} isMe={false} />
        </Col>

        <Col xs={24} md={16}>
          <Card title="Thông tin cá nhân">
            <UpdateProfileForm
              profileForm={profileForm}
              user={user}
              updateUser={() => {}}
              setIsEditing={() => {}}
              isEditing={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default OtherProfile;
