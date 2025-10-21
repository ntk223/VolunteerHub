import {Application} from "../models/Model.js";
import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
class ApplicationRepository {
    async createApplication(eventId, volunteerId) {
        return await Application.create({ event_id: eventId, volunteer_id: volunteerId });
    }

    async getApplicationsByEventId(eventId) {
        return await Application.findAll({ where: { event_id: eventId } });
    }

    async changeApplicationStatus(applicationId, status) {
        const application = await Application.findByPk(applicationId);
        if (application) {
            application.status = status;
            await application.save();
            return application;
        }
        else {
            throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
        }
    }

    async cancelApplication(applicationId) {
        const application = await Application.findByPk(applicationId);
        if (application) {
            application.isCancelled = true
            await application.save();
            return application;
        }
        throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
    }
}

export const applicationRepo = new ApplicationRepository();