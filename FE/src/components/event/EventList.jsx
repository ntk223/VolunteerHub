import React from 'react';
import { List, Empty } from 'antd';
import EventCard from './EventCard';

const EventList = ({ events, userId, onCardClick }) => {
  return (
    <List
      grid={{ gutter: 24, xs: 1, sm: 2, md: 3, lg: 3, xl: 3, xxl: 4 }}
      dataSource={events}
      locale={{ emptyText: <Empty description="Không tìm thấy sự kiện phù hợp" /> }}
      renderItem={(event) => {
        const isJoined = event.participants?.includes(userId);
        return (
          <List.Item>
            <EventCard event={event} isJoined={isJoined} onCardClick={onCardClick} />
          </List.Item>
        );
      }}
    />
  );
};

export default EventList;
