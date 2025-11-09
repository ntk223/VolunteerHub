import React from 'react';
import { Form, Input, message } from 'antd';
import api from '../../../api';
const UpdateProfileForm = ({ profileForm, user, updateUser, setIsEditing, isEditing }) => {
    return (
        <Form
              form={profileForm}
              onFinish={async (values) => {
                try {
                  await api.put(`/user/${user.id}`, values);
                  message.success('Cập nhật thông tin thành công');
                    updateUser({ ...user, ...values });
                  setIsEditing(false);
                  // Reload user info here if needed
                } catch (error) {
                  message.error('Có lỗi xảy ra khi cập nhật thông tin');
                }
              }}
            >

              {isEditing ? (
                <>
                  <Form.Item
                    name="name"
                    label="Họ và tên"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên' }]}
                  >
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="introduce"
                    label="Giới thiệu"
                  >
                    <Input.TextArea rows={4} />
                  </Form.Item>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Họ và tên:</strong>
                    <p>{user?.name}</p>
                  </div>
                  <div style={{ marginBottom: '16px' }}>
                    <strong>Giới thiệu:</strong>
                    <p>{user?.introduce || 'Chưa cập nhật'}</p>
                  </div>
                </>
              )}

              <div style={{ marginBottom: '16px' }}>
                <strong>Email:</strong>
                <p>{user?.email}</p>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <strong>Số điện thoại:</strong>
                <p>{user?.phone || 'Chưa cập nhật'}</p>
              </div>

              {user.role === 'volunteer' && (
                <div style={{ marginBottom: '16px' }}>
                  <strong>Đóng góp</strong>
                  <p>{user.volunteer.contributed || 'Chưa có đóng góp'}</p>
                  <strong>Uy tín</strong>
                  <p>{user.volunteer.credibility}</p>

                </div>
              )}

              {user.role === 'manager' && (
                <div style={{ marginBottom: '16px' }}>
                  <strong>Đơn vị quản lý:</strong>
                  <p>{user.manager.organization || 'Chưa cập nhật'}</p>
                </div>
              )}
            </Form>
    )
    

}

export default UpdateProfileForm;