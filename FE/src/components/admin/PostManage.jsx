import { Table, Tag, Button, message, Space, Avatar, Modal, Select } from "antd";
import { DownloadOutlined } from "@ant-design/icons";
import { useState, useMemo } from "react";
import PostPreview from "./PostPreview";
import { useAuth } from "../../hooks/useAuth";
import { exportPostsToExcel } from "../../utils/excelExport";

const { Option } = Select;
const postTypeMap = {
  discuss: "Thảo luận",
  recruitment: "Tuyển tình nguyện viên",
}
const PostManage = ({ posts, changePostStatus, deletePost }) => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  const [selectedPost, setSelectedPost] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredPosts = useMemo(() => {
    return posts.filter(post => {
      const typeMatch = typeFilter === 'all' || post.postType === typeFilter;
      const statusMatch = statusFilter === 'all' || post.status === statusFilter;
      return typeMatch && statusMatch;
    });
  }, [posts, typeFilter, statusFilter]);
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
        render: (type) => <Tag color={type === "discuss" ? "blue" : "green"}>{postTypeMap[type]}</Tag>,
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
              style={{ width: "70px", textAlign: "center" }}
              onClick={() => {
                Modal.confirm({
                  title: "Bạn có chắc muốn xóa bài viết?",
                  content: `Bài viết ID: "${record.id}" sẽ bị xóa vĩnh viễn.`,
                  okText: "Xóa",
                  okType: "danger",
                  cancelText: "Hủy",
                  centered: true,

                  async onOk() {
                    try {
                      await deletePost(record.id);
                      message.success(`Đã xóa bài viết ID: "${record.id}" bởi ${user.name}`);
                    } catch {
                      message.error("Không thể xóa bài viết.");
                    }
                  }
                });
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
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <span>Lọc theo loại:</span>
          <Select
            value={typeFilter}
            onChange={setTypeFilter}
            style={{ width: 150 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="discuss">Thảo luận</Option>
            <Option value="recruitment">Tuyển tình nguyện viên</Option>
          </Select>
          
          <span>Lọc theo trạng thái:</span>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 150 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="pending">Chờ duyệt</Option>
            <Option value="approved">Đã duyệt</Option>
            <Option value="rejected">Từ chối</Option>
          </Select>
        </Space>
        
        <Button 
          type="primary" 
          icon={<DownloadOutlined />}
          onClick={() => {
            try {
              exportPostsToExcel(filteredPosts);
              message.success('Đã xuất danh sách bài viết thành công!');
            } catch (error) {
              console.error(error);
              message.error('Lỗi khi xuất file Excel');
            }
          }}
        >
          Xuất Excel
        </Button>
      </div>
      
      <Table
        columns={columns}
        dataSource={filteredPosts}
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
