import { notificationRepo } from "../repositories/notificationRepo.js";

class NotificationService {
  async createNotification(data) {
    return await notificationRepo.createNotification(data);
  }

  async getNotificationsByUserId(userId) {
    return await notificationRepo.getNotificationsByUserId(userId);
  }

  async markNotificationAsRead(userId) {
    return await notificationRepo.markNotificationAsRead(userId);
  }

  async deleteNotification(notificationId) {
    return await notificationRepo.deleteNotification(notificationId);
  }
}

export const notificationService = new NotificationService();
