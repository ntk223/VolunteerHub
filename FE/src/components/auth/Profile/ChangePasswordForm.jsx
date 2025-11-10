import { Form, Input, Button, Modal } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import api from '../../../api';
import { message } from 'antd';
const ChangePasswordForm = ({ form, isChangePasswordVisible, setIsChangePasswordVisible }) => {
    const handleChangePassword = async (values) => {
        try {
        await api.put(`/user/password/${user.id}`, {
            oldPassword: values.oldPassword,
            newPassword: values.newPassword,
        });
        message.success('Đổi mật khẩu thành công');
        setIsChangePasswordVisible(false);
        form.resetFields();
        } catch (error) {
        message.error(error.response?.data?.message || 'Có lỗi xảy ra khi đổi mật khẩu');
        }
  };
    return (
    <Modal
        title="Đổi mật khẩu"
        open={isChangePasswordVisible}
        onCancel={() => {
          setIsChangePasswordVisible(false);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          onFinish={handleChangePassword}
          layout="vertical"
        >
          <Form.Item
            name="oldPassword"
            label="Mật khẩu cũ"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu cũ' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu cũ" />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu mới"
            dependencies={['newPassword']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject('Mật khẩu xác nhận không khớp');
                },
              }),
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Xác nhận mật khẩu mới" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Button type="default" onClick={() => {
              setIsChangePasswordVisible(false);
              form.resetFields();
            }} style={{ marginRight: 8 }}>
              Hủy
            </Button>
            <Button type="primary" htmlType="submit">
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    )
}

export default ChangePasswordForm;