import { Table, Tag, Button, message, Select, Space, Card, Typography, Dropdown } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { exportUsersToExcel } from "../../utils/excelExport";

const { Title, Text } = Typography;

const { Option } = Select;
const roleMap = {
  admin: "Quản trị viên",
  volunteer: "Tình nguyện viên",
  manager: "Quản lý",
}
const UserManage = ({ users, toggleUserStatus }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [roleFilter, setRoleFilter] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter(user => {
      const statusMatch = statusFilter === 'all' || user.status === statusFilter;
      const roleMatch = roleFilter === 'all' || user.role === roleFilter;
      return statusMatch && roleMatch;
    });
  }, [users, statusFilter, roleFilter]);
  const userColumns = [
    { title: "Tên người dùng", dataIndex: "name", key: "name" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "volcano" : role === "volunteer" ? "blue" : "green"}>{roleMap[role]}</Tag>
      ),
    },
    {
        title: "Email",
        dataIndex: "email",
        key: "email",
        render: (email) => (
            <span>{email}</span>
        )
    },
    {
        title: "Số điện thoại",
        dataIndex: "phone",
        key: "phone",
        render: (phone) => (
            <span>{phone || "Chưa cập nhật"}</span>
        )
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "red"}>
          {status === "active" ? "Hoạt động" : "Bị khóa"}
        </Tag>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Button
          type={record.status === "active" ? "default" : "primary"}
          danger={record.status === "active"}
          onClick={async () => {
            try {
                if (record.role === 'admin' && record.status === 'active') {
                    message.error("Không thể khóa tài khoản admin.");
                    return;
                }
              await toggleUserStatus(
                record.id,
                record.status === "active" ? "blocked" : "active"
              );
              message.success(
                `${record.status === "active" ? "Đã khóa" : "Đã mở khóa"} ${
                  record.name
                }`
              );
            } catch {
              message.error("Không thể cập nhật trạng thái người dùng.");
            }
          }}
        >
          {record.status === "active" ? "Khóa" : "Mở khóa"}
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: 24 }}>
        <Title level={4} style={{ margin: 0, marginBottom: 4 }}>👥 Danh sách người dùng</Title>
        <Text type="secondary">Quản lý trạng thái và thông tin người dùng</Text>
      </div>
      
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <Text strong>Lọc theo trạng thái:</Text>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="active">Hoạt động</Option>
            <Option value="blocked">Bị khóa</Option>
          </Select>
          
          <Text strong>Lọc theo vai trò:</Text>
          <Select
            value={roleFilter}
            onChange={setRoleFilter}
            style={{ width: 150 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="admin">Admin</Option>
            <Option value="volunteer">Volunteer</Option>
            <Option value="manager">Manager</Option>
          </Select>
        </Space>
        
        <Dropdown
          menu={{
            items: [
              {
                key: 'xlsx',
                label: 'Xuất Excel (.xlsx)',
                onClick: () => {
                  try {
                    exportUsersToExcel(filteredUsers, 'xlsx');
                    message.success('Đã xuất file Excel thành công!');
                  } catch (error) {
                    console.error(error);
                    message.error('Lỗi khi xuất file');
                  }
                },
              },
              {
                key: 'csv',
                label: 'Xuất CSV (.csv)',
                onClick: () => {
                  try {
                    exportUsersToExcel(filteredUsers, 'csv');
                    message.success('Đã xuất file CSV thành công!');
                  } catch (error) {
                    console.error(error);
                    message.error('Lỗi khi xuất file');
                  }
                },
              },
              {
                key: 'json',
                label: 'Xuất JSON (.json)',
                onClick: () => {
                  try {
                    exportUsersToExcel(filteredUsers, 'json');
                    message.success('Đã xuất file JSON thành công!');
                  } catch (error) {
                    console.error(error);
                    message.error('Lỗi khi xuất file');
                  }
                },
              },
            ],
          }}
        >
          <Button type="primary" icon={<DownloadOutlined />} size="large">
            Xuất dữ liệu
          </Button>
        </Dropdown>
      </div>
      
      <Table
        dataSource={filteredUsers}
        columns={userColumns}
        rowKey={(r) => r.id || r._id}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} người dùng`,
        }}
      />
    </div>
  );
};

export default UserManage;
