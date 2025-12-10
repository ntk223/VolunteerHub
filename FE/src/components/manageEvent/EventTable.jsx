import React from "react";
import { Table, Tag, Typography, Select, Button, Space, Modal } from "antd";
import { EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

const { Text } = Typography;
const { Option } = Select;
const { confirm } = Modal;

const approvalStatusMap = {
  approved: { color: "green", label: "Đã duyệt" },
  pending: { color: "orange", label: "Đang chờ" },
  rejected: { color: "red", label: "Bị từ chối" },
};

const EventTable = ({
  events,
  loading,
  appsMap,
  onUpdateProgressStatus,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  expandedRowRender,
  onExpand,
}) => {
  const eventColumns = [
    {
      title: "Tên sự kiện",
      dataIndex: "title",
      key: "title",
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (t) => <Text strong>{t}</Text>,
    },
    {
      title: "Trạng thái duyệt",
      key: "approval",
      dataIndex: "approvalStatus",
      sorter: (a, b) => a.approvalStatus.localeCompare(b.approvalStatus),
      render: (_, row) => (
        <Tag color={approvalStatusMap[row.approvalStatus]?.color || "gray"}>
          {approvalStatusMap[row.approvalStatus]?.label || row.approvalStatus}
        </Tag>
      ),
    },
    {
      title: "Tiến trình",
      dataIndex: "progressStatus",
      key: "progressStatus",
      width: 160,
      sorter: (a, b) => a.progressStatus.localeCompare(b.progressStatus),
      render: (text, record) => {
        return (
          <Select
            value={record.progressStatus}
            onChange={(value) => onUpdateProgressStatus(record.id, value)}
            dropdownMatchSelectWidth={false}
            style={{ width: "100%" }}
          >
            <Option value="incomplete">
              <Tag
                color="gold"
                style={{ width: "100%", textAlign: "center", margin: 0 }}
              >
                Chưa hoàn thành
              </Tag>
            </Option>
            <Option value="completed">
              <Tag
                color="green"
                style={{ width: "100%", textAlign: "center", margin: 0 }}
              >
                Hoàn thành
              </Tag>
            </Option>
            <Option value="cancelled">
              <Tag
                color="red"
                style={{ width: "100%", textAlign: "center", margin: 0 }}
              >
                Đã hủy
              </Tag>
            </Option>
          </Select>
        );
      },
    },
    {
      title: "Đơn ứng tuyển",
      key: "applications",
      align: "center",
      render: (_, record) => {
        const state = appsMap[record.id] || { loading: false, list: [] };
        const pendingCount = state.list.filter(
          (app) => app.status === "pending"
        ).length;
        const totalCount = state.list.length;

        return (
          <div>
            <Text strong style={{ fontSize: 16 }}>
              {totalCount}
            </Text>
            {pendingCount > 0 && (
              <div>
                <Tag color="orange" style={{ marginTop: 4 }}>
                  {pendingCount} chờ duyệt
                </Tag>
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: "Thời gian",
      key: "time",
      render: (_, row) => {
        const s = row.startTime
          ? new Date(row.startTime).toLocaleString()
          : "-";
        const e = row.endTime ? new Date(row.endTime).toLocaleString() : "-";
        return (
          <div>
            {s} — {e}
          </div>
        );
      },
    },
    { title: "Địa điểm", dataIndex: "location", key: "location" },
    {
      title: "Tạo lúc",
      dataIndex: "createdAt",
      key: "createdAt",
      defaultSortOrder: "descend",
      sorter: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
      render: (v) => (v ? new Date(v).toLocaleString() : "-"),
    },
    {
      title: "Hành động",
      key: "actions",
      fixed: "right",
      width: 120,
      align: "center",
      render: (_, record) => (
        <Space size="small" direction="vertical" style={{ width: '100%' }}>
          <Button
            icon={<EyeOutlined />}
            size="small"
            block
            onClick={() => onViewEvent(record)}
          >
            Xem
          </Button>
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            block
            onClick={() => onEditEvent(record)}
          >
            Sửa
          </Button>
          <Button
            danger
            icon={<DeleteOutlined />}
            size="small"
            block
            onClick={() => {
              confirm({
                title: 'Xác nhận xóa sự kiện',
                icon: <ExclamationCircleOutlined />,
                content: `Bạn có chắc muốn xóa sự kiện "${record.title}"? Hành động này không thể hoàn tác.`,
                okText: 'Xóa',
                okType: 'danger',
                cancelText: 'Hủy',
                onOk() {
                  onDeleteEvent(record.id);
                },
              });
            }}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Table
      rowKey="id"
      dataSource={events}
      columns={eventColumns}
      loading={loading}
      scroll={{ x: 1400 }}
      pagination={{
        pageSize: 10,
        showSizeChanger: true,
        showQuickJumper: true,
        showTotal: (total, range) =>
          `${range[0]}-${range[1]} của ${total} sự kiện`,
      }}
      expandable={{
        expandedRowRender,
        onExpand,
      }}
    />
  );
};

export default EventTable;
