import { eventRepo } from "../repositories/eventRepo.js";
import { notificationRepo } from "../repositories/notificationRepo.js";
import { getIO } from "../config/socket.js";

class EventService {
    async getAllEvents() {
        const events = await eventRepo.getAllEvents();
        return events;
    }
    async createEvent(eventData) {
        return await eventRepo.createEvent(eventData);
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
        const notification = await notificationRepo.createNotification({userId, message});
        const io = getIO();
        io.to(`user_${userId}`).emit("newNotification", notification);
        return event
    }
    async updateEventProgressStatus(eventId, status) {
        return await eventRepo.updateEventProgressStatus(eventId, status);
    }
    async getEventsByManagerId(userId) {
    return await eventRepo.getEventsByManagerId(userId);
    }
}

export const eventService = new EventService();