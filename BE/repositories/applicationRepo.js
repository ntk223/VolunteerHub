import {Application, User, Volunteer} from "../models/Model.js";
import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
class ApplicationRepository {
    async createApplication(eventId, volunteerId) {
        return await Application.create({ eventId, volunteerId });
    }

    async getApplicationsByEventId(eventId) {
        return await Application.findAll({ 
            include : [
                { 
                    model: Volunteer, 
                    as: 'volunteer', 
                    include: [
                    { 
                        model: User, 
                        as: 'user', 
                        attributes: ['id', 'name', 'email']
                    }
                ] 
                }
            ],
            where: { eventId } 
        });
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