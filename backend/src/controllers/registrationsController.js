import RegistrationService from "../services/RegistrationService.js";

// Tạo mới form đăng ký vào ở ký túc xá
export async function createRegistration(req, res) {
  try {
    const {
      student_id,
      manager_id,
      period_id,
      preferred_building_id,
      preferred_room_type_id,
      preferred_roommate_id,
      preferences,
      is_special,
      special_verification,
    } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!student_id || !manager_id || !period_id) {
      return res
        .status(400)
        .json({ error: "student_id, manager_id, and period_id are required" });
    }

    const result = await RegistrationService.createRegistration({
      student_id,
      manager_id,
      period_id,
      preferred_building_id,
      preferred_room_type_id,
      preferred_roommate_id,
      preferences,
      is_special,
      special_verification,
    });

    res.status(201).json({
      message: "Đăng ký thành công",
      form_id: result.form_id,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Lấy form đăng ký theo student_id và period_id
export async function getRegistrationByStudentId(req, res) {
  try {
    const { student_id } = req.params;
    const { period_id } = req.query;

    if (!student_id || !period_id) {
      return res
        .status(400)
        .json({ error: "student_id and period_id are required" });
    }

    const form = await RegistrationService.getRegistrationByStudentAndPeriod(
      student_id,
      period_id
    );

    res.json(form);
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Xử lý form đăng ký (update trạng thái)
export async function handleRegistration(req, res) {
  try {
    const { form_id, period_id, form_status } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!form_id || !period_id || !form_status) {
      return res.status(400).json({
        error: "form_id, period_id, and form_status are required",
      });
    }

    // Kiểm tra form_status hợp lệ
    const validStatuses = ["pending", "approved", "rejected"];
    if (!validStatuses.includes(form_status)) {
      return res.status(400).json({
        error: `form_status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const result = await RegistrationService.handleRegistration(
      form_id,
      period_id,
      form_status
    );

    res.json({
      message: "Xử lý form đăng ký thành công",
      ...result,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found")) {
      return res.status(404).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}
