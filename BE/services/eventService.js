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
}

export const eventService = new EventService();