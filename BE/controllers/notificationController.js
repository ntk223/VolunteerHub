import { notificationService } from "../services/notificationService.js";

class NotificationController {
    async getNotificationsByUserId(req, res) {
        const userId = req.params.userId;
        try {
            const notifications = await notificationService.getNotificationsByUserId(userId);
            res.status(200).json(notifications);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch notifications' });
        }
    }
    async markNotificationAsRead(req, res) {
        const userId = req.params.userId;
        try {
            await notificationService.markNotificationAsRead(userId);
            res.status(200).json({ message: 'Notifications marked as read' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to mark notifications as read' });
        }
    }
}

export const notificationController = new NotificationController();