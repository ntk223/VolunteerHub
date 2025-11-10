import { Timeline, Empty, Card, Typography } from 'antd';
import { ClockCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const eventTimeline = [
    {
      date: '2025-10-30',
      title: 'Tham gia sự kiện "Ngày hội công nghệ"',
      description: 'Thảo luận về các xu hướng AI và Blockchain mới nhất.',
    },
    {
      date: '2025-09-18',
      title: 'Workshop ReactJS nâng cao',
      description: 'Cùng đội phát triển xây dựng ứng dụng thực tế bằng React.',
    },
    {
      date: '2025-07-02',
      title: 'Hackathon 2025',
      description: 'Giành giải 3 với dự án Web3 Marketplace.',
    },
  ];
const Activities = () => {

  return (
                <Card
              title={
                <span>
                  <ClockCircleOutlined style={{ marginRight: 8 }} />
                  Sự kiện đã tham gia
                </span>
              }
              style={{
                borderRadius: 12,
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                height: '100%',
              }}
            >
              {eventTimeline.length > 0 ? (
                <Timeline
                  mode="left"
                  items={eventTimeline.map((e) => ({
                    label: <Text type="secondary">{e.date}</Text>,
                    children: (
                      <>
                        <Title level={5} style={{ marginBottom: 4 }}>
                          {e.title}
                        </Title>
                        <Text>{e.description}</Text>
                      </>
                    ),
                  }))}
                />
              ) : (
                <Empty description="Chưa tham gia sự kiện nào" />
              )}
            </Card>
  );
};

export default Activities;