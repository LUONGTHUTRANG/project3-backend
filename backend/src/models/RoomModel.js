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

  static async findByBuilding(buildingId) {
    const [rows] = await db.query(
      `SELECT r.*, rt.capacity, rt.room_price
       FROM rooms r
       JOIN room_types rt ON r.room_type_id = rt.room_type_id
       WHERE r.building_id = ?
       ORDER BY r.room_name`,
      [buildingId]
    );
    return rows;
  }

  static async create(roomData) {
    const { room_name, building_id, room_type_id, room_status = "available", note } =
      roomData;
    const [result] = await db.query(
      `INSERT INTO rooms (room_name, building_id, room_type_id, room_status, note)
       VALUES (?, ?, ?, ?, ?)`,
      [room_name, building_id, room_type_id, room_status, note || null]
    );
    return result.insertId;
  }

  static async update(roomId, roomData) {
    const { room_name, building_id, room_type_id, room_status, note } = roomData;
    const [result] = await db.query(
      `UPDATE rooms
       SET room_name = ?, building_id = ?, room_type_id = ?, room_status = ?, note = ?
       WHERE room_id = ?`,
      [room_name, building_id, room_type_id, room_status, note || null, roomId]
    );
    return result.affectedRows > 0;
  }

  static async updateStatus(roomId, roomStatus) {
    const [result] = await db.query(
      `UPDATE rooms SET room_status = ? WHERE room_id = ?`,
      [roomStatus, roomId]
    );
    return result.affectedRows > 0;
  }

  static async remove(roomId) {
    const [result] = await db.query(`DELETE FROM rooms WHERE room_id = ?`, [
      roomId,
    ]);
    return result.affectedRows > 0;
  }
}

export default RoomModel;
