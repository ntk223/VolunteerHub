import { applicationRepo } from "../repositories/applicationRepo.js";

class ApplicationService {
    async createApplication(eventId, volunteerId) {
        return await applicationRepo.createApplication(eventId, volunteerId);
    }
    async getApplicationsByEventId(eventId) {
        return await applicationRepo.getApplicationsByEventId(eventId);
    }
    async changeApplicationStatus(applicationId, status) {
        return await applicationRepo.changeApplicationStatus(applicationId, status);
    }
    async cancelApplication(applicationId) {
        return await applicationRepo.cancelApplication(applicationId);
    }
}

export const applicationService = new ApplicationService();
