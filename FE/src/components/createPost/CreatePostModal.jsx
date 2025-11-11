import { useState, useEffect } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;

export default function CreatePostModal({ visible, onClose }) {
  const { user } = useAuth();
  const role = user?.role;
  const [loading, setLoading] = useState(false);
  const [events, setEvents] = useState([]);
  const [form] = Form.useForm();

  const allowedTypes =
    role === "manager"
      ? [
          { label: "Discussion", value: "discuss" },
          { label: "Recruitment", value: "recruitment" },
        ]
      : [{ label: "Discussion", value: "discuss" }];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await api.get("/event");
        setEvents(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.warn("Cannot load events:", err);
      }
    };
    fetchEvents();
  }, []);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const authorId = user?.id ?? user?._id ?? null;

      const eventObj = events.find((e) => String(e.id) === String(values.eventId));
      const derivedTitle =
        (values.title && String(values.title).trim()) ||
        (eventObj && (eventObj.title || eventObj.name)) ||
        (values.content && String(values.content).trim().slice(0, 80)) ||
        "Untitled";

      const payload = {
        content: values.content,
        postType: values.postType || "discuss",
        // title: derivedTitle,
        ...(authorId ? { authorId } : {}),
        ...(values.eventId ? { eventId: values.eventId } : {}),
      };

      const res = await api.post("/post", payload);
      const created = res.data;

      if (created?.status === "approved") {
        window.dispatchEvent(new CustomEvent("post:created", { detail: created }));
        message.success("Đăng bài thành công");
      } else {
        message.info("Bài viết đã được gửi, đang chờ duyệt.");
      }

      form.resetFields();
      onClose();
    } catch (err) {
      console.error(err);
      message.error(err?.response?.data?.message || "Không thể tạo bài viết");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title="Tạo bài viết mới"
      open={visible}
      onCancel={onClose}
      okText="Đăng"
      onOk={() => form.submit()}
      confirmLoading={loading}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{ postType: allowedTypes[0].value }}
      >
        <Form.Item
          label="Chọn sự kiện"
          name="eventId"
          dependencies={["postType"]}
          rules={[
            ({ getFieldValue }) => ({
              validator(_, value) {
                const currentType = getFieldValue("postType");
                if (currentType === "recruitment") {
                  if (!value) {
                    return Promise.reject(new Error("Vui lòng chọn sự kiện cho bài tuyển dụng"));
                  }
                }
                return Promise.resolve();
              },
            }),
          ]}
        >
          <Select
            placeholder={events.length ? "Chọn sự kiện" : "Không có sự kiện"}
            allowClear
            options={events.map((e) => ({
              label: e.title || e.name || `Event ${e.id}`,
              value: e.id,
            }))}
            notFoundContent={events.length ? null : "Không tìm thấy sự kiện"}
          />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <TextArea rows={5} placeholder="Viết gì đó..." />
        </Form.Item>

        <Form.Item label="Loại bài viết" name="postType">
          <Select options={allowedTypes} />
        </Form.Item>
      </Form>
    </Modal>
  );
}