import { Table, Tag, Button, message, Select, Space, Modal, Tooltip, Typography, Dropdown } from "antd";
import { DownloadOutlined, DeleteOutlined, EyeOutlined, TeamOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import { exportEventsToExcel } from "../../utils/excelExport";
import EventDetailModal from "../createEvent/EventDetailModal";
import VolunteerListModal from "./VolunteerListModal";
const { Title, Text } = Typography;

const { Option } = Select;
const categoryOptions = [
  { value: 1, label: "Môi trường" },
  { value: 2, label: "Giáo dục" },
  { value: 3, label: "Cộng đồng" },
  { value: 4, label: "Y tế" },
  { value: 5, label: "Văn hóa - Nghệ thuật" },
];

const EventManage = ({ events, changeEventApprovalStatus, deleteEvent }) => {
  const [statusFilter, setStatusFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isEventModalVisible, setIsEventModalVisible] = useState(false);
  const [isVolunteerModalVisible, setIsVolunteerModalVisible] = useState(false);

  const filteredEvents = useMemo(() => {
    return events.filter(event => {
      const matchStatus = statusFilter === 'all' || event.approvalStatus === statusFilter;
      const eventCategoryId = event.categoryId || event.category?.categoryId || event.category?.id;
      const matchCategory = categoryFilter === 'all' || eventCategoryId == categoryFilter;
      return matchStatus && matchCategory;
    });
  }, [events, statusFilter, categoryFilter]);

  const handleViewEvent = (event) => {
    setSelectedEvent(event);
    setIsEventModalVisible(true);
  };

  const handleViewVolunteers = (event) => {
    setSelectedEvent(event);
    setIsVolunteerModalVisible(true);
  };

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
      fixed: 'left',
      width: 200,
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text) => <span style={{ fontWeight: 600 }}>{text}</span>
    },
    {
      title: "Người tạo",
      dataIndex: ["manager", "user", "name"],
      key: "manager",
      width: 150,
      sorter: (a, b) => {
        const nameA = a.manager?.user?.name || "";
        const nameB = b.manager?.user?.name || "";
        return nameA.localeCompare(nameB);
      },
      render: (name) => <span style={{ color: '#555' }}>{name || "—"}</span>,
    },
    {
      title: "Danh mục", 
      dataIndex: ["category", "name"], 
      key: "category",
      width: 130,
      sorter: (a, b) => {
        const catA = a.category?.name || "";
        const catB = b.category?.name || "";
        return catA.localeCompare(catB);
      },
      render: (name) => name ? <Tag color="geekblue">{name}</Tag> : "—",
    },
    {
      title: "Thời gian",
      key: "time",
      width: 220,
      sorter: (a, b) => new Date(a.startTime) - new Date(b.startTime),
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
      sorter: (a, b) => (a.location || "").localeCompare(b.location || ""),
      ellipsis: { showTitle: false },
      render: (loc) => <Tooltip placement="topLeft" title={loc}>{loc || "—"}</Tooltip>,
    },
    {
      title: "Trạng thái",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      width: 120,
      sorter: (a, b) => a.approvalStatus.localeCompare(b.approvalStatus),
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
      fixed: 'right',
      width: 200,
      render: (_, record) => (
        <Space size="small" direction="vertical" style={{ width: '100%' }}>
          {record.approvalStatus === "pending" ? (
            <>
              <div style={{ display: 'flex', gap: 4 }}>
                <Button 
                  type="primary" 
                  size="small"
                  style={{ flex: 1 }}
                  onClick={() => handleApprove(record)} 
                >
                  Duyệt
                </Button>
                <Button 
                  danger
                  size="small"
                  style={{ flex: 1 }}
                  onClick={() => handleReject(record)} 
                >
                  Từ chối
                </Button>
              </div>
              <Button 
                type="link"
                icon={<EyeOutlined />} 
                size="small"
                block
                onClick={() => handleViewEvent(record)} 
              >
                Xem chi tiết
              </Button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', gap: 4 }}>
                <Button 
                  type="link"
                  icon={<EyeOutlined />} 
                  size="small"
                  style={{ flex: 1 }}
                  onClick={() => handleViewEvent(record)} 
                >
                  Xem
                </Button>
                <Button 
                  danger
                  type="link"
                  icon={<DeleteOutlined />} 
                  size="small"
                  style={{ flex: 1 }}
                  onClick={() => handleDelete(record)} 
                >
                  Xóa
                </Button>
              </div>
              <Button 
                type="primary"
                icon={<TeamOutlined />} 
                size="small"
                block
                ghost
                onClick={() => handleViewVolunteers(record)} 
              >
                Danh sách TNV
              </Button>
            </>
          )}
        </Space>
      ),
    }
  ];

  return (
    <div style={{ padding: 0 }}>
      <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Title level={4} style={{ margin: 0, marginBottom: 4 }}>📅 Danh sách sự kiện</Title>
          <Text type="secondary">Quản lý và kiểm duyệt sự kiện tình nguyện</Text>
        </div>
        <Dropdown
          menu={{
            items: [
              {
                key: 'xlsx',
                label: 'Xuất Excel (.xlsx)',
                onClick: () => {
                  try {
                    exportEventsToExcel(filteredEvents, 'xlsx');
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
                    exportEventsToExcel(filteredEvents, 'csv');
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
                    exportEventsToExcel(filteredEvents, 'json');
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
      
      {/* Thanh lọc trạng thái và danh mục */}
      <div style={{ marginBottom: 16 }}>
        <Space size="large">
          <Space>
            <Text strong>Lọc trạng thái:</Text>
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
          <Space>
            <Text strong>Lọc danh mục:</Text>
            <Select
              value={categoryFilter}
              onChange={setCategoryFilter}
              style={{ width: 180 }}
            >
              <Option value="all">Tất cả danh mục</Option>
              {categoryOptions.map(cat => (
                <Option key={cat.value} value={cat.value}>{cat.label}</Option>
              ))}
            </Select>
          </Space>
        </Space>
      </div>

      {/* Bảng dữ liệu */}
      <Table
        dataSource={filteredEvents}
        columns={eventColumns}
        rowKey={(r) => r.id || r._id}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sự kiện`,
        }}
        scroll={{ x: 1200 }} 
      />
      <EventDetailModal 
        visible={isEventModalVisible} 
        event={selectedEvent} 
        onClose={() => setIsEventModalVisible(false)} 
        isAdmin={true}
      />
      <VolunteerListModal
        visible={isVolunteerModalVisible}
        event={selectedEvent}
        onClose={() => setIsVolunteerModalVisible(false)}
      />
    </div>
  );
};

export default EventManage;