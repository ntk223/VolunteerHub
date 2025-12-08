import { Table, Tag, Button, message, Select, Space, Modal, Card, Tooltip } from "antd";
import { DownloadOutlined, CheckOutlined, CloseOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { exportEventsToExcel } from "../../utils/excelExport";

const { Option } = Select;

const EventManage = ({ events, changeEventApprovalStatus, deleteEvent }) => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      return statusFilter === 'all' || event.approvalStatus === statusFilter;
    });
  }, [events, statusFilter]);

  // Xử lý hành động
  const handleApprove = async (record) => {
    try {
      await changeEventApprovalStatus(record.id, "approved");
      message.success(`Đã duyệt "${record.title}"`);
    } catch {
      message.error("Không thể duyệt sự kiện.");
    }
  };

  const handleReject = async (record) => {
    try {
      await changeEventApprovalStatus(record.id, "rejected");
      message.info(`Đã từ chối "${record.title}"`);
    } catch {
      message.error("Không thể từ chối sự kiện.");
    }
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xóa sự kiện?",
      content: `Sự kiện "${record.title}" sẽ bị xóa vĩnh viễn.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteEvent(record.id);
          message.success("Đã xóa sự kiện");
        } catch {
          message.error("Lỗi khi xóa sự kiện");
        }
      },
    });
  };

  const eventColumns = [
    { 
      title: "Tên sự kiện", 
      dataIndex: "title", 
      key: "title", 
      fixed: 'left', // Cố định cột này bên trái
      width: 200,    // Đặt chiều rộng cố định
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: "Người tạo",
      dataIndex: ["manager", "user", "name"],
      key: "manager",
      width: 150,
      render: (name) => <span style={{ color: '#555' }}>{name || "—"}</span>,
    },
    {
      title: "Danh mục", 
      dataIndex: ["category", "name"], 
      key: "category",
      width: 130,
      render: (name) => name ? <Tag color="geekblue">{name}</Tag> : "—",
    },
    {
      title: "Thời gian",
      key: "time",
      width: 220,
      render: (_, record) => {
        const { startTime, endTime } = record;
        if (!startTime || !endTime) return "—";
        const start = new Date(startTime);
        const end = new Date(endTime);
        const sameDay = start.toLocaleDateString("vi-VN") === end.toLocaleDateString("vi-VN");

        return (
          <div style={{ fontSize: '13px', lineHeight: '1.4' }}>
            {sameDay ? (
               <>
                 <div>{start.toLocaleDateString("vi-VN")}</div>
                 <div style={{ color: '#888' }}>
                   {start.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})} - {end.toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                 </div>
               </>
            ) : (
               <span>{start.toLocaleDateString("vi-VN")} - {end.toLocaleDateString("vi-VN")}</span>
            )}
          </div>
        );
      },
    },
    {
      title: "Địa điểm",
      dataIndex: "location",
      key: "location",
      width: 200,
      ellipsis: { showTitle: false }, // Cắt bớt nếu quá dài
      render: (loc) => <Tooltip placement="topLeft" title={loc}>{loc || "—"}</Tooltip>,
    },
    {
      title: "Trạng thái",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      width: 120,
      render: (s) => {
        let color = "default";
        let text = "N/A";
        switch (s) {
          case "pending": color = "orange"; text = "Chờ duyệt"; break;
          case "approved": color = "green"; text = "Đã duyệt"; break;
          case "rejected": color = "red"; text = "Từ chối"; break;
          default: break;
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      fixed: 'right', // Cố định cột này bên phải
      width: 140,
      render: (_, record) => (
        <Space size="small">
          {record.approvalStatus === "pending" && (
            <>
              <Tooltip title="Duyệt">
                <Button 
                  type="primary" 
                  shape="circle" 
                  icon={<CheckOutlined />} 
                  size="small" 
                  onClick={() => handleApprove(record)} 
                />
              </Tooltip>
              <Tooltip title="Từ chối">
                <Button 
                  type="primary" 
                  danger 
                  shape="circle" 
                  icon={<CloseOutlined />} 
                  size="small" 
                  onClick={() => handleReject(record)} 
                />
              </Tooltip>
            </>
          )}
          <Tooltip title="Xóa">
            <Button 
              danger 
              shape="circle" 
              icon={<DeleteOutlined />} 
              size="small" 
              onClick={() => handleDelete(record)} 
            />
          </Tooltip>
        </Space>
      ),
    }
  ];

  return (
    <Card 
      title="Quản lý Sự kiện" 
      extra={
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={() => {
            try {
              exportEventsToExcel(filteredEvents);
              message.success('Xuất file thành công');
            } catch {
              message.error('Lỗi xuất file');
            }
          }}
        >
          Xuất Excel
        </Button>
      }
      bodyStyle={{ padding: 0 }} // Để bảng sát viền Card
      style={{ borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
    >
      {/* Thanh lọc trạng thái */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #f0f0f0', background: '#fafafa' }}>
        <Space>
          <span style={{ fontWeight: 500 }}>Lọc trạng thái:</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 160 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
        </Space>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        dataSource={filteredEvents}
        columns={eventColumns}
        rowKey={(r) => r.id || r._id}
        pagination={{ pageSize: 8 }}
        scroll={{ x: 1200 }} 
      />
    </Card>
  );
};

export default EventManage;