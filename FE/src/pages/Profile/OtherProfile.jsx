import { useState, useEffect, use } from 'react';
import { Card, Form, Row, Col, Spin, message } from 'antd';
import UpdateProfileForm from '../../components/auth/Profile/UpdateProfileForm';
import AvatarCard from '../../components/auth/Profile/AvatarCard';
import Statistics from '../../components/auth/Profile/Statistics';
import Activities from '../../components/auth/Profile/Activities';
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
    <div style={{
        background: '#f5f6fa',
        minHeight: '100vh',
        padding: '40px 0',
        display: 'flex',
        justifyContent: 'center',
      }}>
              <div style={{ width: '100%', maxWidth: 1200 }}>

      <Row gutter={[24, 12]}>
        <Col xs={24} md={12}>
          <AvatarCard user={user} updateUser={() => {}} isMe={false} />
        </Col>
          <Col xs={24} md={12}>
            <Statistics userId={id}/>
          </Col>
        <Col xs={24} md={12}>
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

        <Col xs={24} md={12}>
            <Activities />
        </Col>
      </Row>
      </div>
    </div>
  );
};

export default OtherProfile;
