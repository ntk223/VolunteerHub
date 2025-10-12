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
}


export const eventController = new EventController();


