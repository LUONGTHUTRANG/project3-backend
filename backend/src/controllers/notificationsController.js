import NotificationService from "../services/NotificationService.js";

// Tạo thông báo mới
export async function createNotification(req, res) {
  try {
    const { notification_content, sender_id, receiver_ids } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!notification_content || !sender_id || !receiver_ids) {
      return res.status(400).json({
        error: "notification_content, sender_id, and receiver_ids are required",
      });
    }

    if (!Array.isArray(receiver_ids) || receiver_ids.length === 0) {
      return res.status(400).json({
        error: "receiver_ids must be a non-empty array",
      });
    }

    const result = await NotificationService.createNotification({
      notification_content,
      sender_id,
      receiver_ids,
    });

    res.status(201).json({
      message: "Thông báo được tạo thành công",
      notification_id: result.notification_id,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Lấy thông báo theo ID
export async function getNotificationById(req, res) {
  try {
    const { notification_id } = req.params;

    if (!notification_id) {
      return res.status(400).json({ error: "notification_id is required" });
    }

    const notification = await NotificationService.getNotificationById(
      notification_id
    );

    res.json(notification);
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Lấy danh sách thông báo của sinh viên
export async function getNotificationsByStudent(req, res) {
  try {
    const { student_id } = req.params;
    const { status } = req.query;

    if (!student_id) {
      return res.status(400).json({ error: "student_id is required" });
    }

    const result = await NotificationService.getNotificationsByStudent(
      student_id,
      status
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found") || err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Đánh dấu thông báo là đã đọc
export async function markNotificationAsRead(req, res) {
  try {
    const { notification_id, student_id } = req.body;

    if (!notification_id || !student_id) {
      return res.status(400).json({
        error: "notification_id and student_id are required",
      });
    }

    const result = await NotificationService.markNotificationAsRead(
      notification_id,
      student_id
    );

    res.json({
      message: "Đánh dấu thông báo là đã đọc",
      ...result,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Lưu trữ thông báo (chỉ tác giả có thể)
export async function archiveNotification(req, res) {
  try {
    const { notification_id, manager_id } = req.body;

    if (!notification_id || !manager_id) {
      return res.status(400).json({
        error: "notification_id and manager_id are required",
      });
    }

    const result = await NotificationService.archiveNotification(
      notification_id,
      manager_id
    );

    res.json({
      message: "Thông báo được lưu trữ",
      ...result,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes("Only the notification creator")) {
      return res.status(403).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Lấy danh sách thông báo đã gửi
export async function getNotificationsBySender(req, res) {
  try {
    const { sender_id } = req.params;
    const { status } = req.query;

    if (!sender_id) {
      return res.status(400).json({ error: "sender_id is required" });
    }

    const result = await NotificationService.getNotificationsBySender(
      sender_id,
      status
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found") || err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}
