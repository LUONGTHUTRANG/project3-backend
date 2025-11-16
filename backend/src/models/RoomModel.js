import db from "../db.js";

class RoomModel {
  static async findAvailableByType(roomTypeId) {
    const [rows] = await db.query(
      `SELECT r.room_id FROM rooms r WHERE r.room_type_id = ? AND r.room_status = 'available' LIMIT 1`,
      [roomTypeId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findById(roomId) {
    const [rows] = await db.query("SELECT * FROM rooms WHERE room_id = ?", [
      roomId,
    ]);
    return rows.length > 0 ? rows[0] : null;
  }
}

export default RoomModel;
