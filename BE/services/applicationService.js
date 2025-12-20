import { applicationRepo } from "../repositories/applicationRepo.js";
import { notificationRepo } from "../repositories/notificationRepo.js";
import { getIO } from "../config/socket.js";
import pushNotificationService from "./pushNotificationService.js";

class ApplicationService {
    async createApplication(eventId, volunteerId) {
        const application = await applicationRepo.createApplication(eventId, volunteerId);
        
        // Gửi thông báo đến manager
        try {
            const managerId = application.event?.manager?.user?.id;
            const volunteerName = application.volunteer?.user?.name || 'Tình nguyện viên';
            const eventTitle = application.event?.title || 'Sự kiện';
            
            if (managerId) {
                // Tạo notification trong database
                const message = `${volunteerName} đã đăng ký tham gia sự kiện "${eventTitle}".`;
                const notification = await notificationRepo.createNotification({
                    userId: managerId, 
                    message
                });
                
                // Gửi thông báo qua Socket.IO (real-time)
                const io = getIO();
                io.to(`user_${managerId}`).emit("newNotification", notification);
                
                // Gửi Push Notification
                const pushPayload = {
                    title: 'Đăng ký tham gia mới',
                    body: `${volunteerName} đã đăng ký tham gia sự kiện "${eventTitle}".`,
                    icon: '/logo.png',
                    badge: '/badge.png',
                    tag: `application-new-${application.id}`,
                    data: {
                        type: 'new-application',
                        applicationId: application.id,
                        eventId: eventId,
                        url: `/events/${eventId}/applications`
                    }
                };
                
                await pushNotificationService.sendToUser(managerId, pushPayload);
            }
        } catch (error) {
            console.error('Error sending notification to manager:', error);
            // Không throw error để không ảnh hưởng đến flow chính
        }
        
        return application;
    }
    async getApplicationsByEventId(eventId) {
        return await applicationRepo.getApplicationsByEventId(eventId);
    }
    async changeApplicationStatus(applicationId, status) {

        const application = await applicationRepo.changeApplicationStatus(applicationId, status);
        const userId = application.volunteer.user.id;
        const statusVN = status === 'approved' ? 'được chấp nhận' : status === 'rejected' ? 'bị từ chối' : 'đang chờ xử lý';
        const message = `Đơn ứng tuyển của bạn (ID: ${applicationId}) đã ${statusVN}.`;
        
        // Tạo notification trong database
        const notification = await notificationRepo.createNotification({userId, message});
        
        // Gửi thông báo qua Socket.IO (real-time)
        const io = getIO();
        io.to(`user_${userId}`).emit("newNotification", notification);
        
        // Gửi Push Notification
        try {
            const eventTitle = application.event?.title || 'Sự kiện';
            const pushPayload = {
                title: `Đơn ứng tuyển ${statusVN}`,
                body: `Đơn ứng tuyển của bạn cho sự kiện "${eventTitle}" đã ${statusVN}.`,
                icon: '/logo.png',
                badge: '/badge.png',
                tag: `application-${applicationId}`,
                data: {
                    type: 'application',
                    applicationId: applicationId,
                    status: status,
                    url: `/applications/${applicationId}`
                }
            };
            
            await pushNotificationService.sendToUser(userId, pushPayload);
        } catch (error) {
            console.error('Error sending push notification:', error);
            // Không throw error để không ảnh hưởng đến flow chính
        }
        
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
