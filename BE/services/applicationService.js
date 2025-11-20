import { applicationRepo } from "../repositories/applicationRepo.js";
import { notificationRepo } from "../repositories/notificationRepo.js";
import { getIO } from "../config/socket.js";
class ApplicationService {
    async createApplication(eventId, volunteerId) {
        return await applicationRepo.createApplication(eventId, volunteerId);
    }
    async getApplicationsByEventId(eventId) {
        return await applicationRepo.getApplicationsByEventId(eventId);
    }
    async changeApplicationStatus(applicationId, status) {

        const application = await applicationRepo.changeApplicationStatus(applicationId, status);
        const userId = application.volunteer.user.id;
        const statusVN = status === 'approved' ? 'được chấp nhận' : status === 'rejected' ? 'bị từ chối' : 'đang chờ xử lý';
        const message = `Đơn ứng tuyển của bạn (ID: ${applicationId}) đã ${statusVN}.`;
        const notification = await notificationRepo.createNotification({userId, message});
        const io = getIO();
        io.to(`user_${userId}`).emit("newNotification", notification);
        return application;
    }
    async cancelApplication(applicationId) {
        return await applicationRepo.cancelApplication(applicationId);
    }

    async getApplcationByVolunteerId(volunteerId) {
        return await applicationRepo.getApplcationByVolunteerId(volunteerId);
    }
}

export const applicationService = new ApplicationService();
