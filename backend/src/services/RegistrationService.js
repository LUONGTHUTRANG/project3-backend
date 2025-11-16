import RegistrationModel from "../models/RegistrationModel.js";
import StudentModel from "../models/StudentModel.js";
import ManagerModel from "../models/ManagerModel.js";
import RoomModel from "../models/RoomModel.js";
import RoomStayModel from "../models/RoomStayModel.js";

class RegistrationService {
  static async createRegistration(formData) {
    // Kiểm tra sinh viên có tồn tại
    const student = await StudentModel.findById(formData.student_id);
    if (!student) {
      throw new Error("Student not found");
    }

    // Kiểm tra manager có tồn tại
    const manager = await ManagerModel.findById(formData.manager_id);
    if (!manager) {
      throw new Error("Manager not found");
    }

    // Tạo form đăng ký
    const formId = await RegistrationModel.create(formData);
    return { form_id: formId };
  }

  static async getRegistrationByStudentAndPeriod(studentId, periodId) {
    const registration = await RegistrationModel.findByStudentAndPeriod(
      studentId,
      periodId
    );
    if (!registration) {
      throw new Error("Registration not found");
    }

    // Parse preferences nếu có
    if (registration.preferences) {
      try {
        registration.preferences = JSON.parse(registration.preferences);
      } catch (e) {
        // Ignore parse error
      }
    }

    return registration;
  }

  static async handleRegistration(formId, periodId, formStatus) {
    // Kiểm tra form tồn tại
    const registration = await RegistrationModel.findById(formId);
    if (!registration || registration.period_id !== periodId) {
      throw new Error("Registration not found");
    }

    // Update form status
    await RegistrationModel.updateStatus(formId, periodId, formStatus);

    // Nếu approved, thêm vào room_stay
    if (formStatus === "approved") {
      await this.allocateRoomToStudent(registration);
    }

    return {
      form_id: formId,
      form_status: formStatus,
      time_execute: new Date().toISOString(),
    };
  }

  static async allocateRoomToStudent(registration) {
    try {
      // Nếu có preferred_room_type_id, tìm phòng khả dụng
      if (registration.preferred_room_type_id) {
        const availableRoom = await RoomModel.findAvailableByType(
          registration.preferred_room_type_id
        );

        if (availableRoom) {
          await RoomStayModel.create({
            period_id: registration.period_id,
            room_id: availableRoom.room_id,
            student_id: registration.student_id,
            allocation_type: "manual",
          });
        }
      }
    } catch (err) {
      console.error("Error allocating room:", err);
      // Không throw error, chỉ log warning
    }
  }
}

export default RegistrationService;
