import { Table, Tag, Button, message } from "antd";

const EventManage = ({ events, changeEventApprovalStatus, deleteEvent, user }) => {
  const eventColumns = [
    { title: "Tên sự kiện", dataIndex: "title", key: "title" },
    {
      title: "Người tạo",
      dataIndex: ["manager", "user", "name"],
      key: "manager.user.name",
      render: (name) => <span>{name}</span>,
    },
    {
      title: "Danh mục", dataIndex: ["category", "name"], key: "category.name", render: (name) => <span>{name}</span>,
    },
    {
      title: "Thời gian diễn ra",
      key: "timeRange",
      render: (_, record) => {
        const { startTime, endTime } = record;
        if (!startTime || !endTime) return "—";

        const start = new Date(startTime);
        const end = new Date(endTime);

        const sameDay =
          start.toLocaleDateString("vi-VN") === end.toLocaleDateString("vi-VN");

        const startTimeStr = start.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const endTimeStr = end.toLocaleTimeString("vi-VN", {
          hour: "2-digit",
          minute: "2-digit",
        });
        const startDateStr = start.toLocaleDateString("vi-VN");
        const endDateStr = end.toLocaleDateString("vi-VN");

        return sameDay
          ? `${startTimeStr} - ${endTimeStr}, ${startDateStr}`
          : `${startTimeStr}, ${startDateStr} - ${endTimeStr}, ${endDateStr}`;
      },
    },

    {
    title: "Địa điểm",
    dataIndex: "location",
    key: "location",
    render: (location) => <span>{location || "—"}</span>,
      },
    {
      title: "Trạng thái",
      dataIndex: "approvalStatus",
      key: "approvalStatus",
      render: (s) => (
        <Tag
          color={
            s === "pending"
              ? "orange"
              : s === "approved"
              ? "green"
              : s === "rejected"
              ? "red"
              : "default"
          }
        >
          {s === "pending"
            ? "Chờ duyệt"
            : s === "approved"
            ? "Đã duyệt"
            : s === "rejected"
            ? "Từ chối"
            : "Không xác định"}
        </Tag>

      ),
    },
    {
      title: "Tiến trình",
      dataIndex: "progressStatus",
      key: "progressStatus",
      render: (status) => <span>{status === 'completed' ? 'Hoàn thành' : status === 'incomplete' ? 'Chưa hoàn thành' : 'Đã hủy'}</span>,
    },
    {
      title: "Thời gian tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (d) => new Date(d).toLocaleString("vi-VN"),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {record.approvalStatus === "pending" && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await changeEventApprovalStatus(record.id, "approved");
                    message.success(`Đã duyệt "${record.title}"`);
                  } catch {
                    message.error("Không thể duyệt sự kiện.");
                  }
                }}
              >
                Duyệt
              </Button>

              <Button
                type="primary"
                danger
                onClick={async () => {
                  try {
                    await changeEventApprovalStatus(record.id, "rejected");
                    message.info(`Đã từ chối "${record.title}"`);
                  } catch {
                    message.error("Không thể từ chối sự kiện.");
                  }
                }}
              >
                Từ chối
              </Button>
            </div>
          )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            danger
            style={{ width: "70px", textAlign: "center" }} // tùy chỉnh thêm nếu muốn
            onClick={async () => {
              try {
                await deleteEvent(record.id);
                message.success(`Đã xóa "${record.title}" bởi ${user.name}`);
              } catch {
                message.error("Không thể xóa sự kiện.");
              }
            }}
          >
            Xóa
          </Button>
        </div>
        </div>
      ),
    }

  ];

  return (
    <Table
      dataSource={events}
      columns={eventColumns}
      rowKey={(r) => r.id || r._id}
      pagination={{ pageSize: 5 }}
    />
  );
};

export default EventManage;
