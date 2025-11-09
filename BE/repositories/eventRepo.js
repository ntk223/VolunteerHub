import {Event, Manager, User} from "../models/Model.js";
import ApiError from "../utils/ApiError.js";
import { StatusCodes } from "http-status-codes";
class EventRepository {
    async getAllEvents() {
        const events = await Event.findAll({
            include: ['category', {
                model: Manager, 
                as: 'manager',
                include: [
                    {
                        model: User, 
                        as: 'user'
                    }
                ]
            }]
        });
        return events;
    }

    async createEvent(eventData) {
        const event = await Event.create(eventData)
        return await Event.findByPk(event.id, {include: ['manager', 'category']});
    }

    async deleteEvent(eventId, userId) {
        // console.log(eventId, userId);
        const user = await User.findByPk(userId)
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
        if (event.manager.user.id == userId || user.role === 'admin') {
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
            approvalStatus: status
        };
        if (status == 'approved') {
            obj = {
                progressStatus: 'incomplete',
                approvalStatus: status,
                publishedAt: new Date()
            }
        }
        // console.log(obj);
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
        if (event.approvalStatus !== 'approved') {
            throw new ApiError(StatusCodes.BAD_REQUEST, "Only approved events can have their progress status updated");
        }
        const updatedEvent = await Event.update({progressStatus: status}, {
            where: {id: eventId},
        })
        if (updatedEvent[0] === 0) {
            throw new ApiError(StatusCodes.NOT_FOUND, "Event not found or no changes made")
        }
        return await Event.findByPk(eventId);
    }
}


export const eventRepo = new EventRepository();