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
        const { userid: userId, eventid: eventId } = req.params;
        await eventService.deleteEvent(eventId, userId);
        res.status(StatusCodes.NO_CONTENT).send();
    }

    async updateEvent(req, res) {
        const { eventid: eventId } = req.params;
        const updateData = req.body;
        const updatedEvent = await eventService.updateEvent(eventId, updateData);
        res.status(StatusCodes.OK).json(updatedEvent);
    }

    async updateApprovalStatus(req, res) {
        const { id: eventId } = req.params;
        const { approval_status } = req.body;
        const updatedEvent = await eventService.updateEventApprovalStatus(eventId, approval_status);
        res.status(StatusCodes.OK).json(updatedEvent);
    }

    async updateEventProgressStatus(req, res) {
        const { id: eventId } = req.params;
        const { progress_status } = req.body;
        const updatedEvent = await eventService.updateEventProgressStatus(eventId, progress_status);
        res.status(StatusCodes.OK).json(updatedEvent);
    }
}


export const eventController = new EventController();


