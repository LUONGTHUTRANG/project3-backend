import SupportRequestService from "../services/SupportRequestService.js";

// Tạo yêu cầu hỗ trợ mới
export async function createSupportRequest(req, res) {
  try {
    const { student_id, request_type_id, request_content } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!student_id || !request_type_id || !request_content) {
      return res.status(400).json({
        error: "student_id, request_type_id, and request_content are required",
      });
    }

    const result = await SupportRequestService.createSupportRequest({
      student_id,
      request_type_id,
      request_content,
    });

    res.status(201).json({
      message: "Yêu cầu hỗ trợ được tạo thành công",
      request_id: result.request_id,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found") || err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Lấy danh sách yêu cầu hỗ trợ theo request_type_id và request_status (tùy chọn)
export async function getSupportRequests(req, res) {
  try {
    const { request_type_id, request_status } = req.query;

    if (!request_type_id) {
      return res.status(400).json({
        error: "request_type_id is required",
      });
    }

    const result = await SupportRequestService.getSupportRequests(
      request_type_id,
      request_status
    );

    res.json(result);
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found") || err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}

// Xử lý yêu cầu hỗ trợ (update request_status)
export async function handleSupportRequest(req, res) {
  try {
    const { request_id, request_status, manager_handle_id } = req.body;

    // Kiểm tra dữ liệu bắt buộc
    if (!request_id || !request_status) {
      return res.status(400).json({
        error: "request_id and request_status are required",
      });
    }

    const result = await SupportRequestService.handleSupportRequest(
      request_id,
      request_status,
      manager_handle_id
    );

    res.json({
      message: "Xử lý yêu cầu hỗ trợ thành công",
      ...result,
    });
  } catch (err) {
    console.error(err);
    if (err.message.includes("not found") || err.message.includes("Invalid")) {
      return res.status(400).json({ error: err.message });
    }
    res.status(500).json({ error: "Lỗi server" });
  }
}
