import {Application, User, Volunteer, Event, Category} from "../models/Model.js";
import ApiError from "../utils/ApiError.js";
import {StatusCodes} from "http-status-codes";
class ApplicationRepository {
    async createApplication(eventId, volunteerId) {
        const existingApplication = await Application.findOne({ where: { eventId, volunteerId } });
        if (existingApplication && existingApplication.isCancelled === true) {
            existingApplication.isCancelled = false;
            await existingApplication.save();
            return existingApplication;
        }
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
                        attributes: ['id', 'name', 'email', 'phone']
                    }
                ] 
                }
            ],
            where: { eventId } 
        });
    }

    async changeApplicationStatus(applicationId, status) {
        console.log(applicationId, status);
        const application = await Application.findOne({ 
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
                },
                {
                    model: Event,
                    as: 'event',
                    attributes: ['id', 'title']
                }
            ],
            where: { id: applicationId } 
        });
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

    async getApplcationByVolunteerId(volunteerId) {
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
                },
                {
                    model: Event,
                    as: 'event',
                    attributes: ['id', 'title', 'startTime', 'endTime', 'progressStatus'],
                    include: [
                        {
                            model: Category,
                            as: 'category',
                        }
                    ]
                },
            ],
            where: { volunteerId }
        });
    }

    async comfirmApplication(applicationId) {
        const application = await Application.findByPk(applicationId);
        if (application) {
            application.status = 'attended';
            await application.save();
            return application;
        }
        throw new ApiError(StatusCodes.NOT_FOUND, "Application not found");
    }

}

export const applicationRepo = new ApplicationRepository();