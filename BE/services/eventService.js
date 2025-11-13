import { eventRepo } from "../repositories/eventRepo.js";

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
        return await eventRepo.updateEventApprovalStatus(eventId, status);
    }
    async updateEventProgressStatus(eventId, status) {
        return await eventRepo.updateEventProgressStatus(eventId, status);
    }
    async getEventsByManagerId(userId) {
    return await eventRepo.getEventsByManagerId(userId);
    }
}

export const eventService = new EventService();