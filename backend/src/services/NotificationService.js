import NotificationModel from "../models/NotificationModel.js";
import ManagerModel from "../models/ManagerModel.js";
import StudentModel from "../models/StudentModel.js";

class NotificationService {
  static async createNotification(notificationData) {
    const { notification_content, sender_id, receiver_ids } = notificationData;

    // Kiểm tra sender_id có tồn tại
    const sender = await ManagerModel.findById(sender_id);
    if (!sender) {
      throw new Error("Sender manager not found");
    }

    // Kiểm tra toàn bộ receiver_ids có tồn tại
    if (!receiver_ids || receiver_ids.length === 0) {
      throw new Error("At least one receiver is required");
    }

    for (const receiverId of receiver_ids) {
      const student = await StudentModel.findById(receiverId);
      if (!student) {
        throw new Error(`Student with id ${receiverId} not found`);
      }
    }

    // Tạo thông báo
    const notificationId = await NotificationModel.create({
      notification_content,
      sender_id,
    });

    // Thêm người nhận
    await NotificationModel.addReceivers(notificationId, receiver_ids);

    return { notification_id: notificationId };
  }

  static async getNotificationById(notificationId) {
    const notification = await NotificationModel.getById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    return notification;
  }

  static async getNotificationsByStudent(studentId, status = null) {
    // Kiểm tra sinh viên có tồn tại
    const student = await StudentModel.findById(studentId);
    if (!student) {
      throw new Error("Student not found");
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ["read", "unread"];
    if (status && !validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const notifications = await NotificationModel.getByStudentId(
      studentId,
      status
    );
    return {
      total: notifications.length,
      data: notifications,
    };
  }

  static async markNotificationAsRead(notificationId, studentId) {
    // Kiểm tra notification có tồn tại
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    // Mark as read
    const updated = await NotificationModel.markAsRead(
      notificationId,
      studentId
    );
    if (!updated) {
      throw new Error("Could not mark notification as read");
    }

    return { notification_id: notificationId, status: "read" };
  }

  static async archiveNotification(notificationId, managerId) {
    // Kiểm tra notification có tồn tại
    const notification = await NotificationModel.findById(notificationId);
    if (!notification) {
      throw new Error("Notification not found");
    }

    // Kiểm tra manager là người tạo notification
    if (notification.sender_id !== managerId) {
      throw new Error("Only the notification creator can archive it");
    }

    const archived = await NotificationModel.archiveNotification(
      notificationId
    );
    if (!archived) {
      throw new Error("Could not archive notification");
    }

    return { notification_id: notificationId, status: "archived" };
  }

  static async getNotificationsBySender(senderId, status = null) {
    // Kiểm tra manager có tồn tại
    const manager = await ManagerModel.findById(senderId);
    if (!manager) {
      throw new Error("Manager not found");
    }

    // Kiểm tra status hợp lệ
    const validStatuses = ["active", "archived"];
    if (status && !validStatuses.includes(status)) {
      throw new Error(
        `Invalid status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const notifications = await NotificationModel.getBySenderId(
      senderId,
      status
    );
    return {
      total: notifications.length,
      data: notifications,
    };
  }
}

export default NotificationService;
