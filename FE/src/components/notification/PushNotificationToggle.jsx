import React from 'react';
import { Card, Switch, Space, Typography, Alert, Button, Divider, theme } from 'antd';
import { BellOutlined, CheckCircleOutlined, CloseCircleOutlined, ThunderboltOutlined } from '@ant-design/icons';
import usePushNotification from '../../hooks/usePushNotification';
import { useAuth } from '../../hooks/useAuth';

const { Text, Title, Paragraph } = Typography;

const PushNotificationToggle = () => {
  const { user } = useAuth();
  const { token } = theme.useToken();
  const { 
    isSupported, 
    isSubscribed, 
    loading, 
    permission,
    subscribe, 
    unsubscribe,
    testNotification 
  } = usePushNotification(user);

  const handleToggle = async (checked) => {
    if (checked) {
      await subscribe();
    } else {
      await unsubscribe();
    }
  };

  if (!isSupported) {
    return (
      <Card
        style={{
          borderRadius: token.borderRadiusLG,
          boxShadow: token.boxShadowTertiary,
        }}
      >
        <Alert
          message="Trình duyệt không hỗ trợ"
          description="Trình duyệt của bạn không hỗ trợ thông báo đẩy. Vui lòng sử dụng Chrome, Firefox hoặc Edge phiên bản mới nhất."
          type="warning"
          showIcon
          icon={<CloseCircleOutlined />}
        />
      </Card>
    );
  }

  return (
    <Card
      style={{
        borderRadius: token.borderRadiusLG,
        boxShadow: token.boxShadowTertiary,
      }}
    >
      <Space direction="vertical" style={{ width: '100%' }} size="large">
        {/* Header */}
        <Space align="start" style={{ width: '100%', justifyContent: 'space-between' }}>
          <Space align="center">
            <BellOutlined 
              style={{ 
                fontSize: 28, 
                color: isSubscribed ? token.colorPrimary : token.colorTextSecondary 
              }} 
            />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Thông báo đẩy
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Nhận thông báo ngay cả khi không mở website
              </Text>
            </div>
          </Space>
          <Switch
            checked={isSubscribed}
            onChange={handleToggle}
            loading={loading}
            checkedChildren={<CheckCircleOutlined />}
            unCheckedChildren={<CloseCircleOutlined />}
          />
        </Space>

        <Divider style={{ margin: 0 }} />

        {/* Status */}
        {isSubscribed ? (
          <Alert
            message="Đang hoạt động"
            description="Bạn sẽ nhận được thông báo khi có sự kiện mới, đơn ứng tuyển được duyệt, hoặc có hoạt động quan trọng khác."
            type="success"
            showIcon
            icon={<CheckCircleOutlined />}
          />
        ) : (
          <Alert
            message="Chưa bật"
            description={
              permission === 'denied' 
                ? 'Bạn đã từ chối quyền thông báo. Vui lòng vào cài đặt trình duyệt để bật lại.'
                : 'Bật thông báo để không bỏ lỡ các cập nhật quan trọng từ VolunteerHub.'
            }
            type="info"
            showIcon
          />
        )}

        {/* Test button */}
        {isSubscribed && (
          <>
            <Divider style={{ margin: 0 }} />
            <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Text strong>Thử nghiệm thông báo</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Gửi một thông báo thử để kiểm tra
                </Text>
              </div>
              <Button 
                icon={<ThunderboltOutlined />}
                onClick={testNotification}
                type="default"
              >
                Gửi thử
              </Button>
            </Space>
          </>
        )}

        {/* Info */}
        <div style={{ 
          background: token.colorBgLayout, 
          padding: 12, 
          borderRadius: token.borderRadius 
        }}>
          <Paragraph style={{ margin: 0, fontSize: 12 }} type="secondary">
            <strong>Lưu ý:</strong>
            <ul style={{ margin: '8px 0 0 0', paddingLeft: 20 }}>
              <li>Thông báo đẩy chỉ hoạt động trên HTTPS hoặc localhost</li>
              <li>Bạn có thể bật/tắt bất kỳ lúc nào</li>
              <li>Mỗi thiết bị cần đăng ký riêng</li>
            </ul>
          </Paragraph>
        </div>
      </Space>
    </Card>
  );
};

export default PushNotificationToggle;
