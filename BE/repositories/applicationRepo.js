import {Application} from "../models/Model.js";

class ApplicationRepository {
    async createApplication(eventId, volunteerId) {
        return await Application.create({ event_id: eventId, volunteer_id: volunteerId });
    }
}

export const applicationRepo = new ApplicationRepository();