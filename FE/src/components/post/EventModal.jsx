import { Modal, Descriptions, Image, Typography } from "antd";
import { CalendarOutlined, EnvironmentOutlined, TeamOutlined } from "@ant-design/icons";
import { useState } from "react";

const { Title } = Typography;
const EventModal = ({event, isModalVisible, setIsModalVisible}) => {
    return (
        <Modal
        title={<Title level={3}>{event?.title || "Chi tiết sự kiện"}</Title>}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800}
      >
        {event && (
          <div>
            {event.media && (
              <Image src={event.media} alt={event.title} style={{ width: "100%", borderRadius: 8, marginBottom: 16 }} />
            )}

            <Descriptions bordered column={1}>
              <Descriptions.Item label={<><CalendarOutlined /> Thời gian</>}>
                {event.startTime && new Date(event.startTime).toLocaleString("vi-VN")}
                {event.endTime && ` → ${new Date(event.endTime).toLocaleString("vi-VN")}`}
              </Descriptions.Item>

              <Descriptions.Item label={<><EnvironmentOutlined /> Địa điểm</>}>
                {event.location || "Chưa cập nhật"}
              </Descriptions.Item>

              <Descriptions.Item label={<><TeamOutlined /> Số lượng cần tuyển</>}>
                {event.capacity || event.slots || "Không giới hạn"}
              </Descriptions.Item>

              <Descriptions.Item label="Mô tả chi tiết">
                <div style={{ whiteSpace: "pre-wrap" }}>
                  {event.description || "Không có mô tả"}
                </div>
              </Descriptions.Item>
            </Descriptions>
          </div>
        )}
      </Modal>
    )
}

export default EventModal;