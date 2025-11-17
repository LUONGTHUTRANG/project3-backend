import db from "../db.js";

class RoomTypeModel {
  static async findById(roomTypeId) {
    const [rows] = await db.query(
      "SELECT * FROM room_types WHERE room_type_id = ?",
      [roomTypeId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByBuilding(buildingId) {
    const [rows] = await db.query(
      `SELECT * FROM room_types WHERE building_id = ? ORDER BY room_type_id`,
      [buildingId]
    );
    return rows;
  }
}

export default RoomTypeModel;
