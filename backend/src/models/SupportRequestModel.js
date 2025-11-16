import db from "../db.js";

class SupportRequestModel {
  static async findById(requestId) {
    const [rows] = await db.query(
      "SELECT * FROM support_request WHERE request_id = ?",
      [requestId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(requestData) {
    const { student_id, request_type_id, request_content } = requestData;

    const [result] = await db.query(
      `INSERT INTO support_request (student_id, request_type_id, request_content)
       VALUES (?, ?, ?)`,
      [student_id, request_type_id, request_content]
    );

    return result.insertId;
  }

  static async updateStatus(requestId, requestStatus, managerHandleId = null) {
    const [result] = await db.query(
      `UPDATE support_request SET request_status = ?, manager_handle_id = ? WHERE request_id = ?`,
      [requestStatus, managerHandleId || null, requestId]
    );

    return result.affectedRows > 0;
  }

  static async getByTypeAndStatus(requestTypeId, requestStatus = null) {
    let query = `SELECT sr.*, s.student_name, srt.name as request_type_name, m.manager_name
                 FROM support_request sr
                 JOIN students s ON sr.student_id = s.student_id
                 JOIN support_request_types srt ON sr.request_type_id = srt.id
                 LEFT JOIN managers m ON sr.manager_handle_id = m.manager_id
                 WHERE sr.request_type_id = ?`;
    const params = [requestTypeId];

    if (requestStatus) {
      query += ` AND sr.request_status = ?`;
      params.push(requestStatus);
    }

    query += ` ORDER BY sr.time_request DESC`;

    const [rows] = await db.query(query, params);
    return rows;
  }

  static async findRequestTypeById(typeId) {
    const [rows] = await db.query(
      `SELECT * FROM support_request_types WHERE id = ? AND is_active = 1`,
      [typeId]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

export default SupportRequestModel;
