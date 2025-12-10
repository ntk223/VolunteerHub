import React from "react";
import { Table, Tag, Space, Button, Avatar, Typography, Spin } from "antd";
import { UserOutlined } from "@ant-design/icons";

const { Text } = Typography;

const applicationStatusMap = {
  pending: { color: "blue", label: "Đang chờ" },
  approved: { color: "green", label: "Đã duyệt" },
  rejected: { color: "red", label: "Bị từ chối" },
  attended: { color: "purple", label: "Đã tham gia" },
};

const ApplicantTable = ({
  eventId,
  applicants,
  loading,
  onChangeStatus,
  onReload,
}) => {
  const applicantColumns = [
    {
      title: "Ứng viên",
      key: "applicant",
      render: (_, r) => {
        const u = r.user;
        return (
          <Space>
            <Avatar size="small" src={u?.avatarUrl} icon={<UserOutlined />} />
            <div>
              <div>{u?.name}</div>
              <div style={{ fontSize: 12, color: "#666" }}>{u?.email}</div>
            </div>
          </Space>
        );
      },
    },
    {
      title: "Thời gian ứng tuyển",
      dataIndex: "appliedAt",
      key: "appliedAt",
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (s) => (
        <Tag color={applicationStatusMap[s]?.color || "gray"}>
          {applicationStatusMap[s]?.label || s}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, r) => {
        if (r.status !== "pending") {
          return <Text type="secondary">Đã xử lý</Text>;
        }
        return (
          <Space>
            <Button
              size="small"
              type="primary"
              onClick={() => onChangeStatus(r.id, "approved", eventId)}
            >
              Duyệt
            </Button>
            <Button
              size="small"
              danger
              onClick={() => onChangeStatus(r.id, "rejected", eventId)}
            >
              Từ chối
            </Button>
          </Space>
        );
      },
    },
  ];

  return (
    <div style={{ padding: 12 }}>
      <Button onClick={onReload} style={{ marginBottom: 12 }}>
        Tải lại danh sách ứng viên
      </Button>

      {loading ? (
        <Spin />
      ) : applicants.length === 0 ? (
        <Text type="secondary">Chưa có ứng viên nào đăng ký</Text>
      ) : (
        <Table
          rowKey="id"
          pagination={false}
          dataSource={applicants}
          columns={applicantColumns}
        />
      )}
    </div>
  );
};

export default ApplicantTable;
