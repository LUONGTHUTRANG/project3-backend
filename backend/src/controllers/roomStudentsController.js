import RoomStayService from "../services/RoomStayService.js";

export async function getStudentsByRoom(req, res) {
  try {
    const { room_id } = req.params;
    const students = await RoomStayService.getStudentsByRoom(room_id);
    res.json({ total: students.length, data: students });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function addStudentToRoom(req, res) {
  try {
    const { room_id } = req.params;
    const { student_id, period_id, allocation_type } = req.body;
    if (!student_id || !period_id) {
      return res
        .status(400)
        .json({ error: "student_id and period_id are required" });
    }
    const result = await RoomStayService.addStudentToRoom({
      room_id,
      student_id,
      period_id,
      allocation_type,
    });
    res
      .status(201)
      .json({ message: "Thêm sinh viên vào phòng thành công", ...result });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    if (err.message.includes("full") || err.message.includes("already")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

export async function deleteStudentFromRoom(req, res) {
  try {
    const { room_id, student_id } = req.params;
    await RoomStayService.removeStudentFromRoom(room_id, student_id);
    res.status(204).end();
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}
