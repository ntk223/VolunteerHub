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
        console.log(newEvent);
        res.status(StatusCodes.CREATED).json(newEvent);
    }
}


export const eventController = new EventController();


