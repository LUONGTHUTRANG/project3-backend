import db from "../db.js";

class StudentModel {
  static async findById(studentId) {
    const [rows] = await db.query(
      "SELECT * FROM students WHERE student_id = ?",
      [studentId]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async findByMSSV(mssv) {
    const [rows] = await db.query(
      "SELECT * FROM students WHERE student_MSSV = ?",
      [mssv]
    );
    return rows.length > 0 ? rows[0] : null;
  }

  static async create(studentData) {
    const {
      student_name,
      gender,
      dob,
      student_address,
      student_phone,
      student_email,
      student_MSSV,
      province,
      year_of_study,
      major,
    } = studentData;

    const [result] = await db.query(
      `INSERT INTO students (
        student_name, gender, dob, student_address, student_phone, student_email,
        student_MSSV, province, year_of_study, major
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_name,
        gender,
        dob,
        student_address,
        student_phone,
        student_email,
        student_MSSV,
        province,
        year_of_study,
        major,
      ]
    );

    return result.insertId;
  }

  static async update(studentId, studentData) {
    const updates = [];
    const values = [];

    for (const [key, value] of Object.entries(studentData)) {
      updates.push(`${key} = ?`);
      values.push(value);
    }

    values.push(studentId);

    const [result] = await db.query(
      `UPDATE students SET ${updates.join(", ")} WHERE student_id = ?`,
      values
    );

    return result.affectedRows > 0;
  }
}

export default StudentModel;
