import { eventService } from "../services/eventService.js";
import { StatusCodes } from "http-status-codes";
class EventController {
    async getAllEvents(req, res) {
        const events = await eventService.getAllEvents();
        res.status(StatusCodes.OK).json(events);
    }
    async createEvent(req, res) {
        const eventData = req.body;
        const newEvent = await eventService.createEvent(eventData);
        res.status(StatusCodes.CREATED).json(newEvent);
    }

    async deleteEvent(req, res) {
        const { userId, eventId } = req.params;
        await eventService.deleteEvent(eventId, userId);
        res.status(StatusCodes.NO_CONTENT).send();
    }

    async updateEvent(req, res) {
        const eventId  = req.params.id;
        const updateData = req.body;
        const updatedEvent = await eventService.updateEvent(eventId, updateData);
        res.status(StatusCodes.OK).json(updatedEvent);
    }

    async updateApprovalStatus(req, res) {
        const eventId = req.params.id;
        const { approvalStatus } = req.body;
        const updatedEvent = await eventService.updateEventApprovalStatus(eventId, approvalStatus);
        res.status(StatusCodes.OK).json(updatedEvent);
    }

    async updateEventProgressStatus(req, res) {
        const eventId = req.params.id;
        const { progressStatus } = req.body;
        const updatedEvent = await eventService.updateEventProgressStatus(eventId, progressStatus);
        res.status(StatusCodes.OK).json(updatedEvent);
    }
}


export const eventController = new EventController();


