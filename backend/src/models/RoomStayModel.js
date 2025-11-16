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
}

export default RoomStayModel;
