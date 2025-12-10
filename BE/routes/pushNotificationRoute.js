import express from 'express';
import { pushNotificationController } from '../controllers/pushNotificationController.js';
import verifyTokenMiddleware from '../middlewares/verifyToken.js';

const Router = express.Router();

/**
 * @swagger
 * /api/push/subscribe:
 *   post:
 *     summary: Subscribe to push notifications
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscription
 *             properties:
 *               subscription:
 *                 type: object
 *                 properties:
 *                   endpoint:
 *                     type: string
 *                   keys:
 *                     type: object
 *                     properties:
 *                       p256dh:
 *                         type: string
 *                       auth:
 *                         type: string
 *     responses:
 *       200:
 *         description: Successfully subscribed
 */
Router.post('/subscribe', verifyTokenMiddleware, pushNotificationController.subscribe);

/**
 * @swagger
 * /api/push/unsubscribe:
 *   post:
 *     summary: Unsubscribe from push notifications
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - endpoint
 *             properties:
 *               endpoint:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successfully unsubscribed
 */
Router.post('/unsubscribe', verifyTokenMiddleware, pushNotificationController.unsubscribe);

/**
 * @swagger
 * /api/push/public-key:
 *   get:
 *     summary: Get VAPID public key
 *     tags: [Push Notifications]
 *     responses:
 *       200:
 *         description: Returns VAPID public key
 */
Router.get('/public-key', pushNotificationController.getPublicKey);

/**
 * @swagger
 * /api/push/test:
 *   post:
 *     summary: Send test push notification
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Test notification sent
 */
Router.post('/test', verifyTokenMiddleware, pushNotificationController.testPush);

/**
 * @swagger
 * /api/push/subscriptions:
 *   get:
 *     summary: Get user's push subscriptions
 *     tags: [Push Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns user's subscriptions
 */
Router.get('/subscriptions', verifyTokenMiddleware, pushNotificationController.getSubscriptions);

export default Router;
