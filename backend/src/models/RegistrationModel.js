import db from "../db.js";

class RegistrationModel {
  static async findById(formId) {
    const [rows] = await db.query(
      "SELECT * FROM form_register WHERE form_id = ?",
      [formId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByStudentAndPeriod(studentId, periodId) {
    const [rows] = await db.query(
      "SELECT * FROM form_register WHERE student_id = ? AND period_id = ?",
      [studentId, periodId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(formData) {
    const {
      student_id,
      manager_id,
      period_id,
      preferred_building_id,
      preferred_room_type_id,
      preferred_roommate_id,
      preferences,
      is_special,
      special_verification,
    } = formData;

    const [result] = await db.query(
      `INSERT INTO form_register (
        student_id, manager_id, period_id, preferred_building_id, preferred_room_type_id,
        preferred_roommate_id, preferences, is_special, special_verification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        manager_id,
        period_id,
        preferred_building_id || null,
        preferred_room_type_id || null,
        preferred_roommate_id || null,
        preferences ? JSON.stringify(preferences) : null,
        is_special ? 1 : 0,
        special_verification || null,
      ]
    );

    return result.insertId;
  }

  static async updateStatus(formId, periodId, formStatus, timeExecute = true) {
    const query = timeExecute
      ? `UPDATE form_register SET form_status = ?, time_execute = NOW() WHERE form_id = ? AND period_id = ?`
      : `UPDATE form_register SET form_status = ? WHERE form_id = ? AND period_id = ?`;

    const [result] = await db.query(query, [formStatus, formId, periodId]);
    return result.affectedRows > 0;
  }

  static async getByPeriodAndStatus(periodId, formStatus = null) {
    let query = `SELECT * FROM form_register WHERE period_id = ?`;
    const params = [periodId];

    if (formStatus) {
      query += ` AND form_status = ?`;
      params.push(formStatus);
    }

    query += ` ORDER BY time_register DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  }
}

export default RegistrationModel;
