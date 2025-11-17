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

  static async findAll() {
    const [rows] = await db.query(
      `SELECT manager_id, manager_name, manager_address, manager_phone, manager_CCCD, manager_email
       FROM managers ORDER BY manager_name`
    );
    return rows;
  }

  static async update(managerId, managerData) {
    const { manager_name, manager_address, manager_phone, manager_CCCD, manager_email } = managerData;
    const [result] = await db.query(
      `UPDATE managers
       SET manager_name = ?, manager_address = ?, manager_phone = ?, manager_CCCD = ?, manager_email = ?
       WHERE manager_id = ?`,
      [manager_name, manager_address, manager_phone, manager_CCCD, manager_email, managerId]
    );
    return result.affectedRows > 0;
  }

  static async remove(managerId) {
    const [result] = await db.query(
      `DELETE FROM managers WHERE manager_id = ?`,
      [managerId]
    );
    return result.affectedRows > 0;
  }
}

export default ManagerModel;
