import { Table, Tag, Button, message, Space, Avatar, Modal } from "antd";
import { useState } from "react";
import PostPreview from "./PostPreview";
const PostManage = ({ posts, changePostStatus }) => {
  const [loading, setLoading] = useState(false);

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const columns = [
      {
        title: "Tác giả",
        dataIndex: "author",
        key: "author",
        render: (author) => (
          <Space>
            <Avatar src={author?.avatarUrl} alt={author?.name}>
              {author?.name?.charAt(0)}
            </Avatar>
            <span>{author?.name}</span>
          </Space>
        ),
      },
      {
        title: "Loại bài viết",
        dataIndex: "postType",
        key: "postType",
        render: (type) => <Tag color="blue">{type}</Tag>,
      },
      {
        title: "Nội dung",
        dataIndex: "content",
        key: "content",
        render: (text) => (
          <span>
            {text?.length > 80 ? text.slice(0, 80) + "..." : text || "—"}
          </span>
        ),
      },
      {
        title: "Lượt thích",
        dataIndex: "likeCount",
        key: "likeCount",
        align: "center",
      },
      {
        title: "Bình luận",
        dataIndex: "commentCount",
        key: "commentCount",
        align: "center",
      },
      {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {record.status === "pending" && (
            <div style={{ display: "flex", gap: 8 }}>
              <Button
                type="primary"
                onClick={async () => {
                  try {
                    await changePostStatus(record.id, "approved");
                    message.success(`Đã duyệt bài của "${record.author?.name}"`);
                  } catch {
                    message.error("Không thể duyệt bài viết.");
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
                    await changePostStatus(record.id, "rejected");
                    message.info(`Đã từ chối bài của "${record.author?.name}"`);
                  } catch {
                    message.error("Không thể từ chối bài viết.");
                  }
                }}
              >
                Từ chối
              </Button>
            </div>
          )}

        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
              type="link"
              onClick={() => handlePreview(record)}
            >
              Xem
            </Button>
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

const handlePreview = (record) => {
    setSelectedPost(record);
    setIsModalOpen(true);
  };

  return (
    <>
      <Table
        columns={columns}
        dataSource={posts}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 8 }}
      />

      {/* Modal Preview */}
      <PostPreview
        selectedPost={selectedPost}
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
      />
    </>
  );
};

export default PostManage;
