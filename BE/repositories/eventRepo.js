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

    async updateEvent(eventId, updateData) {
        const updatedEvent = await Event.update(updateData, {
            where: {id: eventId},
        })
        if (updatedEvent[0] === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found or no changes made")
        }
        return await Event.findByPk(eventId);
    }

    async updateEventApprovalStatus(eventId, status) {
        let obj = {        
            approval_status: status
        };
        if (status == 'approved') {
            obj = {
                progress_status: 'incomplete',
                approval_status: status,
                publishedAt: new Date()
            }
        }
        console.log(obj);
        const updatedEvent = await Event.update(obj, {
            where: {id: eventId},
        })
        if (updatedEvent[0] === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found or no changes made")
        }
        return await Event.findByPk(eventId);
    }

    async updateEventProgressStatus(eventId, status) {
        const event = await Event.findByPk(eventId);
        if (!event) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found");
        }
        if (event.approval_status !== 'approved') {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Only approved events can have their progress status updated");
        }
        const updatedEvent = await Event.update({progress_status: status}, {
            where: {id: eventId},
        })
        if (updatedEvent[0] === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found or no changes made")
        }
        return await Event.findByPk(eventId);
    }
}


export const eventRepo = new EventRepository();