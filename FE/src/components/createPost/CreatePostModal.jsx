import React, { useState, useEffect, useRef, useCallback, useMemo } from "react"; // <--- Thêm useMemo
import { Modal, Form, Input, Select, message, Spin, Upload } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;

const normalizeEvent = (e) => ({
  id: e.id,
  title: e.title,
  managerId: e.manager_id,
  approvalStatus: e.approval_status ?? e.approvalStatus ?? e.status,
});

export default function CreatePostModal({ visible, onClose }) {
  const { user } = useAuth();
  const [form] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [fetchingEvents, setFetchingEvents] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [postType, setPostType] = useState("discuss");

  const searchTimeoutRef = useRef(null);
  const mountedRef = useRef(true);

  const isManager = user?.role === "manager";

  // --- FIX: Dùng useMemo để tránh tạo lại mảng này mỗi lần render ---
  const allowedTypes = useMemo(() => {
    return isManager
      ? [
          { label: "Thảo luận (Discussion)", value: "discuss" },
          { label: "Tuyển dụng (Recruitment)", value: "recruitment" },
        ]
      : [{ label: "Thảo luận (Discussion)", value: "discuss" }];
  }, [isManager]);

  // --- Fetch Events ---
  const fetchEvents = useCallback(async (searchText = "") => {
    setFetchingEvents(true);
    try {
      const currentType = form.getFieldValue("postType") || "discuss";
      let list = [];

      if (currentType === "recruitment") {
        const res = await api.get(`/event/manager/${user.id}`);
        list = Array.isArray(res.data) ? res.data.map(normalizeEvent) : [];
        if (searchText) {
          const lower = searchText.toLowerCase();
          list = list.filter((e) => e.title.toLowerCase().includes(lower));
        }
        list = list.filter((ev) => (ev.approvalStatus || "").toLowerCase() === "approved");
      } else {
        // const url = searchText
        const res = await api.get(`/event`); 
        list = Array.isArray(res.data) ? res.data.filter(((e) => e.approvalStatus == "approved")).map(normalizeEvent) : [];
        const lower = searchText.toLowerCase().trim();
              // Dùng includes để lọc title
        list = list.filter((e) => e.title.toLowerCase().includes(lower));
      }

      if (mountedRef.current) {
        setEvents(list);
      }
    } catch (error) {
      console.error("Lỗi lấy danh sách sự kiện:", error);
    } finally {
      if (mountedRef.current) setFetchingEvents(false);
    }
  }, [form, user.id]); // allowedTypes không cần thiết ở đây vì ta đọc từ form

  // --- Effect Init ---
  useEffect(() => {
    mountedRef.current = true;
    if (visible) {
      // Đặt giá trị mặc định khi mở modal
      const defaultType = allowedTypes[0].value;
      setPostType(defaultType);
      form.setFieldsValue({ postType: defaultType });
      
      // Gọi fetch ngay lập tức
      fetchEvents();
    }

    return () => {
      mountedRef.current = false;
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    };
    // FIX: dependency array an toàn vì allowedTypes đã được memoized
  }, [visible, fetchEvents, allowedTypes, form]); 

  // ... (Phần còn lại của component giữ nguyên như cũ)
  
  const handlePostTypeChange = (value) => {
    setPostType(value);
    form.setFieldsValue({ eventId: null });
    setEvents([]);
    setTimeout(() => fetchEvents(), 0);
  };

  const handleSearch = (value) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    searchTimeoutRef.current = setTimeout(() => {
      fetchEvents(value);
    }, 400);
  };

  const uploadSingleFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file.originFileObj);
    formData.append("userId", user.id);
    try {
      const res = await api.post("/file/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data?.file?.url;
    } catch (err) {
      console.error(`Lỗi upload file ${file.name}:`, err);
      message.error(`Không thể upload file: ${file.name}`);
      return null;
    }
  };

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const uploadPromises = fileList.map((file) => uploadSingleFile(file));
      const results = await Promise.all(uploadPromises);
      const uploadedMediaUrls = results.filter((url) => url !== null);

      if (fileList.length > 0 && uploadedMediaUrls.length === 0) {
        throw new Error("Tất cả file đều upload thất bại. Vui lòng thử lại.");
      }

      const payload = {
        authorId: user.id,
        content: values.content,
        postType: values.postType,
        eventId: values.eventId || null,
        media: uploadedMediaUrls,
      };

      const res = await api.post("/post", payload);

      if (res.data?.status === "approved") {
        message.success("Đăng bài thành công!");
        window.dispatchEvent(new CustomEvent("post:created", { detail: res.data }));
      } else {
        message.info("Bài viết đang chờ duyệt.");
      }
      handleClose();
    } catch (err) {
      console.error(err);
      message.error(err.message || "Có lỗi xảy ra khi tạo bài viết");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    form.resetFields();
    setFileList([]);
    setPostType(allowedTypes[0].value);
    onClose();
  };

  const handlePreview = async (file) => {
    let src = file.url || file.preview;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
      file.preview = src;
    }
    if (file.type?.startsWith("video/") || file.originFileObj?.type?.startsWith("video/")) {
      const win = window.open("", "_blank");
      win.document.write(`
        <html><body style='margin:0;display:flex;align-items:center;justify-content:center;background:black;'>
          <video src="${src}" controls autoplay style="max-width:100%;max-height:100vh;"></video>
        </body></html>
      `);
    } else {
      const imgWindow = window.open(src);
      if (imgWindow) {
        const image = new Image();
        image.src = src;
        imgWindow.document.write(image.outerHTML);
      }
    }
  };

  return (
    <Modal
      title="Tạo bài viết mới"
      open={visible}
      onCancel={handleClose}
      okText="Đăng bài"
      cancelText="Hủy"
      onOk={() => form.submit()}
      confirmLoading={loading}
      destroyOnClose
      maskClosable={!loading}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ postType: allowedTypes[0].value }}
      >
        <Form.Item label="Loại bài viết" name="postType">
          <Select options={allowedTypes} onChange={handlePostTypeChange} />
        </Form.Item>

        <Form.Item
          label={postType === "recruitment" ? "Chọn sự kiện (Bắt buộc)" : "Chọn sự kiện (Tùy chọn)"}
          name="eventId"
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (getFieldValue("postType") === "recruitment" && !value) {
                  return Promise.reject(new Error("Vui lòng chọn sự kiện cho bài tuyển dụng"));
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Select
            showSearch
            allowClear
            placeholder="Tìm kiếm sự kiện..."
            onSearch={handleSearch}
            filterOption={false}
            notFoundContent={fetchingEvents ? <Spin size="small" /> : "Không tìm thấy sự kiện"}
            options={events.map((e) => ({ label: e.title, value: e.id }))}
          />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung bài viết" }]}
        >
          <TextArea rows={5} placeholder="Bạn đang nghĩ gì?" showCount maxLength={2000} />
        </Form.Item>

        <Form.Item label="Hình ảnh / Video">
          <Upload
            listType="picture-card"
            accept="image/*,video/*"
            fileList={fileList}
            onChange={({ fileList: newFileList }) => setFileList(newFileList)}
            beforeUpload={(file) => {
              const isMedia = file.type.startsWith("image/") || file.type.startsWith("video/");
              if (!isMedia) {
                message.error("Chỉ chấp nhận file Ảnh hoặc Video!");
                return Upload.LIST_IGNORE;
              }
              const isLt20M = file.size / 1024 / 1024 < 20;
              if (!isLt20M) {
                message.error("File phải nhỏ hơn 20MB!");
                return Upload.LIST_IGNORE;
              }
              return false;
            }}
            onPreview={handlePreview}
          >
            {fileList.length >= 10 ? null : (
              <div>
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Thêm</div>
              </div>
            )}
          </Upload>
        </Form.Item>
      </Form>
    </Modal>
  );
}