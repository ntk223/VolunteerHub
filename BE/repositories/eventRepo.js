import Event from "../models/Event.js"
import User from "../models/User.js"
import Manager from "../models/Manager.js"
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
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

    async deleteEvent(eventId, userId) {
        console.log(eventId, userId);
        const event = await Event.findByPk(eventId, {
            include: [
                {
                    model: Manager, 
                    as: 'manager',
                    include: [
                        {
                            model: User, 
                            as: 'user'
                        }
                    ]
                }
            
        ]});
        // console.log(event);
        if (!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found");
        }
        // console.log(event.manager.user.id, userId);
        if (event.manager.user.id == userId) {
            return await Event.destroy({where: {id: eventId}});
        }
        throw new ApiError(StatusCodes.FORBIDDEN, "You are not authorized to delete this event");
    }
}


export const eventRepo = new EventRepository();