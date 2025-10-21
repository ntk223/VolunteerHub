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
}
export const applicationController = new ApplicationController();
