import webpush from 'web-push';
import { PushSubscription } from '../models/Model.js';

// Configure web-push với VAPID keys
webpush.setVapidDetails(
  process.env.VAPID_EMAIL || 'mailto:admin@volunteerhub.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

class PushNotificationService {
  
  /**
   * Lưu subscription từ client
   * @param {number} userId - ID của user
   * @param {object} subscription - Push subscription object từ browser
   */
  async saveSubscription(userId, subscription) {
    try {
      // Kiểm tra subscription đã tồn tại chưa
      const existing = await PushSubscription.findOne({
        where: { 
          userId,
          endpoint: subscription.endpoint 
        }
      });

      if (existing) {
        // Update keys nếu subscription đã tồn tại
        await existing.update({
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
        });
        return existing;
      }

      // Tạo subscription mới
      return await PushSubscription.create({
        userId,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      });
    } catch (error) {
      console.error('Error saving subscription:', error);
      throw error;
    }
  }

  /**
   * Gửi push notification đến một user
   * @param {number} userId - ID của user
   * @param {object} payload - Nội dung notification
   */
  async sendToUser(userId, payload) {
    try {
      const subscriptions = await PushSubscription.findAll({
        where: { userId }
      });

      if (subscriptions.length === 0) {
        console.log(`No push subscriptions found for user ${userId}`);
        return { success: true, sent: 0 };
      }

      const notifications = subscriptions.map(sub => {
        const pushSubscription = {
          endpoint: sub.endpoint,
          keys: {
            p256dh: sub.p256dh,
            auth: sub.auth,
          }
        };

        return webpush.sendNotification(pushSubscription, JSON.stringify(payload))
          .catch(err => {
            console.error('Error sending to subscription:', err);
            // Nếu subscription hết hạn (410 Gone), xóa khỏi DB
            if (err.statusCode === 410) {
              console.log(`Removing expired subscription for user ${userId}`);
              sub.destroy();
            }
          });
      });

      await Promise.all(notifications);
      return { success: true, sent: subscriptions.length };
    } catch (error) {
      console.error('Error sending notifications to user:', error);
      throw error;
    }
  }

  /**
   * Gửi push notification đến nhiều users
   * @param {number[]} userIds - Mảng các user IDs
   * @param {object} payload - Nội dung notification
   */
  async sendToMultipleUsers(userIds, payload) {
    try {
      const results = await Promise.all(
        userIds.map(userId => this.sendToUser(userId, payload))
      );
      
      const totalSent = results.reduce((sum, result) => sum + result.sent, 0);
      console.log(`Sent push notifications to ${totalSent} devices`);
      
      return { success: true, totalSent };
    } catch (error) {
      console.error('Error sending to multiple users:', error);
      throw error;
    }
  }

  /**
   * Xóa subscription
   * @param {number} userId - ID của user
   * @param {string} endpoint - Endpoint của subscription
   */
  async removeSubscription(userId, endpoint) {
    try {
      const deleted = await PushSubscription.destroy({
        where: { userId, endpoint }
      });
      return { success: true, deleted };
    } catch (error) {
      console.error('Error removing subscription:', error);
      throw error;
    }
  }

  /**
   * Xóa tất cả subscriptions của một user
   * @param {number} userId - ID của user
   */
  async removeAllUserSubscriptions(userId) {
    try {
      const deleted = await PushSubscription.destroy({
        where: { userId }
      });
      return { success: true, deleted };
    } catch (error) {
      console.error('Error removing all subscriptions:', error);
      throw error;
    }
  }

  /**
   * Lấy tất cả subscriptions của một user
   * @param {number} userId - ID của user
   */
  async getUserSubscriptions(userId) {
    try {
      return await PushSubscription.findAll({
        where: { userId }
      });
    } catch (error) {
      console.error('Error getting user subscriptions:', error);
      throw error;
    }
  }
}

export default new PushNotificationService();
