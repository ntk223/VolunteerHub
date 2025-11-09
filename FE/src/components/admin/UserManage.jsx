import { Table, Tag, Button, message } from "antd";

const UserManage = ({ users, toggleUserStatus }) => {
  const userColumns = [
    { title: "Tên người dùng", dataIndex: "name", key: "name" },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role) => (
        <Tag color={role === "admin" ? "volcano" : "blue"}>{role}</Tag>
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
    <Table
      dataSource={users}
      columns={userColumns}
      rowKey={(r) => r.id || r._id}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default UserManage;
