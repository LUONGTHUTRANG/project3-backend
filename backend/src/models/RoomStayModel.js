import db from "../db.js";

class RoomStayModel {
  static async create(stayData) {
    const {
      period_id,
      room_id,
      student_id,
      allocation_type = "manual",
    } = stayData;

    const [result] = await db.query(
      `INSERT INTO room_stay (period_id, room_id, student_id, start_date, stay_status, allocation_type)
       VALUES (?, ?, ?, NOW(), 'active', ?)`,
      [period_id, room_id, student_id, allocation_type]
    );

    return result.insertId;
  }

  static async findByStudentAndPeriod(studentId, periodId) {
    const [rows] = await db.query(
      "SELECT * FROM room_stay WHERE student_id = ? AND period_id = ?",
      [studentId, periodId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async getStudentsByRoom(roomId) {
    const [rows] = await db.query(
      `SELECT rs.*, s.student_name, s.student_MSSV, s.student_email, s.student_phone
       FROM room_stay rs
       JOIN students s ON rs.student_id = s.student_id
       WHERE rs.room_id = ? AND rs.stay_status = 'active'
       ORDER BY rs.start_date DESC`,
      [roomId]
    );
    return rows;
  }

  static async removeStudentFromRoom(roomId, studentId) {
    const [result] = await db.query(
      `UPDATE room_stay
       SET stay_status = 'finished', end_date = NOW()
       WHERE room_id = ? AND student_id = ? AND stay_status = 'active'`,
      [roomId, studentId]
    );
    return result.affectedRows > 0;
  }

  static async findActiveByStudent(studentId, periodId = null) {
    let query =
      "SELECT * FROM room_stay WHERE student_id = ? AND stay_status = 'active'";
    const params = [studentId];
    if (periodId) {
      query += " AND period_id = ?";
      params.push(periodId);
    }
    const [rows] = await db.query(query, params);
    return rows.length > 0 ? rows[0] : null;
  }
}

export default RoomStayModel;
