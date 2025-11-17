import RoomModel from "../models/RoomModel.js";
import StudentModel from "../models/StudentModel.js";
import RoomStayModel from "../models/RoomStayModel.js";
import RoomTypeModel from "../models/RoomTypeModel.js";

class RoomStayService {
  static async getStudentsByRoom(roomId) {
    const room = await RoomModel.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }
    const students = await RoomStayModel.getStudentsByRoom(roomId);
    return students;
  }

  static async addStudentToRoom({ room_id, student_id, period_id, allocation_type = "manual" }) {
    if (!period_id) {
      throw new Error("period_id is required");
    }

    const room = await RoomModel.findById(room_id);
    if (!room) {
      throw new Error("Room not found");
    }

    const student = await StudentModel.findById(student_id);
    if (!student) {
      throw new Error("Student not found");
    }

    // Check existing active stay for this student in the same period
    const existingStay = await RoomStayModel.findActiveByStudent(student_id, period_id);
    if (existingStay) {
      throw new Error("Student already assigned to a room in this period");
    }

    // Capacity check
    const roomType = await RoomTypeModel.findById(room.room_type_id);
    const activeStudents = await RoomStayModel.getStudentsByRoom(room_id);
    if (roomType && activeStudents.length >= roomType.capacity) {
      throw new Error("Room is full");
    }

    const stayId = await RoomStayModel.create({
      period_id,
      room_id,
      student_id,
      allocation_type,
    });

    // If room now reaches capacity, mark it full
    if (roomType && activeStudents.length + 1 >= roomType.capacity && room.room_status !== "full") {
      await RoomModel.updateStatus(room_id, "full");
    }

    return { stay_id: stayId };
  }

  static async removeStudentFromRoom(roomId, studentId) {
    const room = await RoomModel.findById(roomId);
    if (!room) {
      throw new Error("Room not found");
    }

    const removed = await RoomStayModel.removeStudentFromRoom(roomId, studentId);
    if (!removed) {
      throw new Error("Student not found in room");
    }
    return true;
  }
}

export default RoomStayService;
