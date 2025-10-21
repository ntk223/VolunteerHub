import { applicationRepo } from "../repositories/applicationRepo.js";

class ApplicationService {
    async createApplication(eventId, volunteerId) {
        return await applicationRepo.createApplication(eventId, volunteerId);
    }
}

export const applicationService = new ApplicationService();
