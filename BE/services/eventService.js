import { eventRepo } from "../repositories/eventRepo.js";

class EventService {
    async getAllEvents() {
        const events = await eventRepo.getAllEvents();
        return events;
    }
    async createEvent(eventData) {
        return await eventRepo.createEvent(eventData);
    }
}

export const eventService = new EventService();