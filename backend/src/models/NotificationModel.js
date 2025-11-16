import db from "../db.js";

class NotificationModel {
  static async findById(notificationId) {
    const [rows] = await db.query(
      "SELECT * FROM notification WHERE notification_id = ?",
      [notificationId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(notificationData) {
    const { notification_content, sender_id } = notificationData;

    const [result] = await db.query(
      `INSERT INTO notification (notification_content, sender_id, notification_status)
       VALUES (?, ?, 'active')`,
      [notification_content, sender_id]
    );

    return result.insertId;
  }

  static async addReceivers(notificationId, receiverIds) {
    if (!receiverIds || receiverIds.length === 0) {
      return;
    }

    const values = receiverIds.map((receiverId) => [
      notificationId,
      receiverId,
      "unread",
    ]);

    await db.query(
      `INSERT INTO notification_receiver (notification_id, receiver_id, notification_receive_status)
       VALUES ?`,
      [values]
    );
  }

  static async getById(notificationId) {
    const [notification] = await db.query(
      `SELECT n.*, m.manager_name as sender_name
       FROM notification n
       LEFT JOIN managers m ON n.sender_id = m.manager_id
       WHERE n.notification_id = ?`,
      [notificationId]
    );

    if (notification.length === 0) {
      return null;
    }

    // Lấy danh sách người nhận
    const [receivers] = await db.query(
      `SELECT nr.*, s.student_name
       FROM notification_receiver nr
       JOIN students s ON nr.receiver_id = s.student_id
       WHERE nr.notification_id = ?`,
      [notificationId]
    );

    return {
      ...notification[0],
      receivers,
    };
  }

  static async getByStudentId(studentId, status = null) {
    let query = `SELECT n.*, m.manager_name as sender_name, nr.notification_receive_status
                 FROM notification n
                 LEFT JOIN managers m ON n.sender_id = m.manager_id
                 JOIN notification_receiver nr ON n.notification_id = nr.notification_id
                 WHERE nr.receiver_id = ? AND n.notification_status = 'active'`;
    const params = [studentId];

    if (status) {
      query += ` AND nr.notification_receive_status = ?`;
      params.push(status);
    }

    query += ` ORDER BY n.notification_time DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async markAsRead(notificationId, studentId) {
    const [result] = await db.query(
      `UPDATE notification_receiver
       SET notification_receive_status = 'read'
       WHERE notification_id = ? AND receiver_id = ?`,
      [notificationId, studentId]
    );

    return result.affectedRows > 0;
  }

  static async archiveNotification(notificationId) {
    const [result] = await db.query(
      `UPDATE notification
       SET notification_status = 'archived'
       WHERE notification_id = ?`,
      [notificationId]
    );

    return result.affectedRows > 0;
  }

  static async getBySenderId(senderId, status = null) {
    let query = `SELECT n.*, m.manager_name as sender_name, COUNT(nr.receiver_id) as receiver_count
                 FROM notification n
                 LEFT JOIN managers m ON n.sender_id = m.manager_id
                 LEFT JOIN notification_receiver nr ON n.notification_id = nr.notification_id
                 WHERE n.sender_id = ?`;
    const params = [senderId];

    if (status) {
      query += ` AND n.notification_status = ?`;
      params.push(status);
    }

    query += ` GROUP BY n.notification_id ORDER BY n.notification_time DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  }
}

export default NotificationModel;
