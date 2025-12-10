import { eventRepo } from "../repositories/eventRepo.js";
import { notificationRepo } from "../repositories/notificationRepo.js";
import { getIO } from "../config/socket.js";
import pushNotificationService from "./pushNotificationService.js";
const DEFAULT_ADMIN_ID = 55;
class EventService {
    async getAllEvents() {
        const events = await eventRepo.getAllEvents();
        return events;
    }
    async createEvent(eventData) {
        const newEvent = await eventRepo.createEvent(eventData);
        const message = `Sự kiện mới đã được tạo: ${newEvent.title}. Vui lòng phê duyệt.`;
        const notification = await notificationRepo.createNotification({
            userId: DEFAULT_ADMIN_ID,
            message,
        });
        const io = getIO();
        io.to(`user_${DEFAULT_ADMIN_ID}`).emit("newNotification", notification);
        
        // Gửi push notification đến browser
        try {
            const pushPayload = {
                title: '🆕 Sự kiện mới cần phê duyệt',
                body: message,
                icon: newEvent.imgUrl || '/logo.png',
                url: `/admin`,
                tag: `new-event-${newEvent.id}`,
                data: {
                    eventId: newEvent.id,
                    type: 'new-event',
                },
            };
            
            await pushNotificationService.sendToUser(DEFAULT_ADMIN_ID, pushPayload);
            console.log(`Push notification sent to admin for new event ${newEvent.id}`);
        } catch (pushError) {
            console.error('Error sending push notification:', pushError);
            // Không throw error để không ảnh hưởng đến luồng chính
        }

        return newEvent;
    }

    async deleteEvent(eventId, userId) {
        return await eventRepo.deleteEvent(eventId, userId);
    }

    async updateEvent(eventId, updateData) {
        return await eventRepo.updateEvent(eventId, updateData);
    }

    async updateEventApprovalStatus(eventId, status) {
        const {event, userId} = await eventRepo.updateEventApprovalStatus(eventId, status);
        const statusVN = status === 'approved' ? 'được phê duyệt' : 'bị từ chối';
        const message = `Sự kiện của bạn (ID: ${eventId}, Tên: ${event.title}) đã ${statusVN}.`;
        
        // Tạo notification trong DB
        const notification = await notificationRepo.createNotification({userId, message});
        
        // Gửi real-time notification qua Socket.io
        const io = getIO();
        io.to(`user_${userId}`).emit("newNotification", notification);
        
        // Gửi push notification đến browser
        try {
            const emoji = status === 'approved' ? '✅' : '❌';
            const pushPayload = {
                title: `${emoji} Thông báo về sự kiện`,
                body: message,
                icon: event.imgUrl || '/logo.png',
                url: `/manage-events`,
                tag: `event-approval-${eventId}`,
                data: {
                    eventId,
                    status,
                    type: 'event-approval',
                },
            };
            
            await pushNotificationService.sendToUser(userId, pushPayload);
            console.log(`Push notification sent to user ${userId} for event ${eventId}`);
        } catch (pushError) {
            console.error('Error sending push notification:', pushError);
            // Không throw error để không ảnh hưởng đến luồng chính
        }
        
        return event;
    }
    async updateEventProgressStatus(eventId, status) {
        return await eventRepo.updateEventProgressStatus(eventId, status);
    }
    async getEventsByManagerId(userId) {
    return await eventRepo.getEventsByManagerId(userId);
    }
}

export const eventService = new EventService();