import { applicationService } from "../services/applicationService.js";
import StatusCodes from "http-status-codes";
import { Application } from "../models/Model.js";
class ApplicationController {
  async createApplication(req, res) {
    const { eventId, volunteerId } = req.body;
    try {
      const application = await applicationService.createApplication(
        eventId,
        volunteerId
      );
      res.status(StatusCodes.CREATED).json(application);
      }

    catch (error) {
      console.error("Lỗi tạo đơn:", error);
      res.status(500).json({
        message: "Lỗi server",
        error: error.message,
      });
    }
  }
  async getApplicationsByEventId(req, res) {
    const eventId = req.params.eventId;
    const applications = await applicationService.getApplicationsByEventId(
      eventId
    );
    res.status(StatusCodes.OK).json(applications);
  }
  async changeApplicationStatus(req, res) {
    const applicationId = req.params.id;
    const { status } = req.body;
    try {
      const updatedApplication =
        await applicationService.changeApplicationStatus(applicationId, status);
      res.status(StatusCodes.OK).json(updatedApplication);
    } catch (error) {
      if (error.statusCode === StatusCodes.NOT_FOUND) {
        res.status(StatusCodes.NOT_FOUND).json({ error: error.message });
      } else {
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: error.message });
      }
    }
  }
  async cancelApplication(req, res) {
    const applicationId = req.params.id;
    const cancelledApplication = await applicationService.cancelApplication(
      applicationId
    );
    res.status(StatusCodes.OK).json(cancelledApplication);
  }

  async getApplcationByVolunteerId(req, res) {
    const volunteerId = req.params.volunteerId;
    const applications = await applicationService.getApplcationByVolunteerId(
      volunteerId
    );
    res.status(StatusCodes.OK).json(applications);
  }
}
export const applicationController = new ApplicationController();
