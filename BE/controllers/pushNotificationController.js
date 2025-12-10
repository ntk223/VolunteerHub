import pushNotificationService from '../services/pushNotificationService.js';
import { StatusCodes } from 'http-status-codes';

class PushNotificationController {
  
  /**
   * Subscribe to push notifications
   * POST /api/push/subscribe
   */
  async subscribe(req, res) {
    try {
      const { subscription } = req.body;
      const userId = req.user.id;

      if (!subscription || !subscription.endpoint || !subscription.keys) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Invalid subscription object',
        });
      }

      await pushNotificationService.saveSubscription(userId, subscription);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Đăng ký nhận thông báo đẩy thành công',
      });
    } catch (error) {
      console.error('Subscribe error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Lỗi khi đăng ký nhận thông báo',
      });
    }
  }

  /**
   * Unsubscribe from push notifications
   * POST /api/push/unsubscribe
   */
  async unsubscribe(req, res) {
    try {
      const { endpoint } = req.body;
      const userId = req.user.id;

      if (!endpoint) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          success: false,
          message: 'Endpoint is required',
        });
      }

      await pushNotificationService.removeSubscription(userId, endpoint);

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Hủy đăng ký thành công',
      });
    } catch (error) {
      console.error('Unsubscribe error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Lỗi khi hủy đăng ký',
      });
    }
  }

  /**
   * Get VAPID public key
   * GET /api/push/public-key
   */
  getPublicKey(req, res) {
    try {
      const publicKey = process.env.VAPID_PUBLIC_KEY;

      if (!publicKey) {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          success: false,
          message: 'VAPID public key not configured',
        });
      }

      res.status(StatusCodes.OK).json({
        success: true,
        publicKey,
      });
    } catch (error) {
      console.error('Get public key error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Lỗi khi lấy public key',
      });
    }
  }

  /**
   * Test push notification (for development)
   * POST /api/push/test
   */
  async testPush(req, res) {
    try {
      const userId = req.user.id;

      await pushNotificationService.sendToUser(userId, {
        title: '🧪 Test Notification',
        body: 'Đây là thông báo đẩy thử nghiệm từ VolunteerHub',
        icon: '/logo.png',
        url: '/',
        tag: 'test',
      });

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Đã gửi thông báo thử nghiệm',
      });
    } catch (error) {
      console.error('Test push error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Lỗi khi gửi thông báo thử nghiệm',
      });
    }
  }

  /**
   * Get user's subscriptions
   * GET /api/push/subscriptions
   */
  async getSubscriptions(req, res) {
    try {
      const userId = req.user.id;
      const subscriptions = await pushNotificationService.getUserSubscriptions(userId);

      res.status(StatusCodes.OK).json({
        success: true,
        subscriptions,
      });
    } catch (error) {
      console.error('Get subscriptions error:', error);
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: 'Lỗi khi lấy danh sách subscriptions',
      });
    }
  }
}

export const pushNotificationController = new PushNotificationController();
