import db from "../db.js";

class BuildingModel {
  static async findById(buildingId) {
    const [rows] = await db.query(
      "SELECT * FROM buildings WHERE building_id = ?",
      [buildingId]
    );
    return rows.length > 0 ? rows[0] : null;
  }
}

export default BuildingModel;
