import { useState } from "react";
import { Modal, Form, Input, Select, message } from "antd";
import api from "../../api";
import { useAuth } from "../../hooks/useAuth";

const { TextArea } = Input;

export default function CreatePostModal({ visible, onClose }) {
  const { user } = useAuth();
  const role = user?.role;
  const [loading, setLoading] = useState(false);

  const allowedTypes = role === "manager" ? [
    { label: "Discussion", value: "discuss" },
    { label: "Recruitment", value: "recruitment" }
  ] : [
    { label: "Discussion", value: "discuss" }
  ];

  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
  setLoading(true);
  try {
    const authorId = user?.id ?? user?._id ?? null;
    const payload = {
      content: values.content,
      postType: values.postType || "discuss",
      title: values.title || "",
      ...(authorId ? { authorId } : {}),
      ...(values.eventId ? { eventId: values.eventId } : {}),
    };
    const res = await api.post("/post", payload);
    const created = res.data;

    if (created?.status === "approved") {
      window.dispatchEvent(new CustomEvent("post:created", { detail: created }));
      message.success("Đăng bài thành công");
    } else {
      // thông báo cho user biết bài đang chờ duyệt
      message.info("Bài viết của bạn đã được gửi, đang chờ duyệt và sẽ xuất hiện khi được duyệt.");
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
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Tiêu đề (tuỳ chọn)" name="title">
          <Input placeholder="Tiêu đề ngắn" maxLength={120} />
        </Form.Item>

        <Form.Item
          label="Nội dung"
          name="content"
          rules={[{ required: true, message: "Vui lòng nhập nội dung" }]}
        >
          <TextArea rows={5} placeholder="Viết gì đó..." />
        </Form.Item>

        <Form.Item label="Loại bài viết" name="postType" initialValue={allowedTypes[0].value}>
          <Select options={allowedTypes} />
        </Form.Item>
      </Form>
    </Modal>
  );
}