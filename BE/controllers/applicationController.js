import { applicationService } from "../services/applicationService.js";
import StatusCodes from "http-status-codes";
class ApplicationController {
    async createApplication (req, res) {
        const { eventId, volunteerId } = req.body;
        const application = await applicationService.createApplication(eventId, volunteerId);
        if (application) {
            res.status(StatusCodes.CREATED).json(application);
        } else {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
        }
    }
    async getApplicationsByEventId(req, res) {
        const { eventId } = req.params;
        const applications = await applicationService.getApplicationsByEventId(eventId);
        res.status(StatusCodes.OK).json(applications);
    }
    async changeApplicationStatus(req, res) {
        const { applicationId } = req.params;
        const { status } = req.body;
        try {
            const updatedApplication = await applicationService.changeApplicationStatus(applicationId, status);
            res.status(StatusCodes.OK).json(updatedApplication);
        } catch (error) {
            if (error.statusCode === StatusCodes.NOT_FOUND) {
                res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
            } else {
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: error.message });
            }
        }
    }
    async cancelApplication(req, res) {
        const { applicationId } = req.params;
        const canceledApplication = await applicationService.cancelApplication(applicationId);
        res.status(StatusCodes.OK).json(canceledApplication);
    }
}
export const applicationController = new ApplicationController();
