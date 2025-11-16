import db from "../db.js";

class ManagerModel {
  static async findById(managerId) {
    const [rows] = await db.query(
      "SELECT * FROM managers WHERE manager_id = ?",
      [managerId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(managerData) {
    const {
      manager_name,
      manager_address,
      manager_phone,
      manager_CCCD,
      manager_email,
    } = managerData;

    const [result] = await db.query(
      `INSERT INTO managers (manager_name, manager_address, manager_phone, manager_CCCD, manager_email)
       VALUES (?, ?, ?, ?, ?)`,
      [
        manager_name,
        manager_address,
        manager_phone,
        manager_CCCD,
        manager_email,
      ]
    );

    return result.insertId;
  }
}

export default ManagerModel;
