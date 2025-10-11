import Event from "../models/Event.js"

class EventRepository {
    async getAllEvents() {
        const events = await Event.findAll({
            include: ['manager', 'category']
        });
        return events;
    }

    async createEvent(eventData) {
        const event = await Event.create(eventData)
        return await Event.findByPk(event.id, {include: ['manager', 'category']});
    }

    // async 
}


export const eventRepo = new EventRepository();