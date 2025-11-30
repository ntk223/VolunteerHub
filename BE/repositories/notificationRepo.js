import {Notification} from '../models/Model.js';

class NotificationRepository {
  async createNotification(data) {
    // data = { userId, message }
    return await Notification.create(data);
  }

  async getNotificationsByUserId(userId) {
    return await Notification.findAll({ where: { userId }, order: [['createdAt', 'DESC']] });
  }

  async markNotificationAsRead(userId) {
    return await Notification.update({ isRead: true }, { where: { userId } });
  }

  async deleteNotification(notificationId) {
    return await Notification.destroy({ where: { id: notificationId } });
  }
}

export const notificationRepo = new NotificationRepository();

