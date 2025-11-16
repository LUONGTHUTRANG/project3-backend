import SupportRequestModel from "../models/SupportRequestModel.js";
import StudentModel from "../models/StudentModel.js";
import ManagerModel from "../models/ManagerModel.js";

class SupportRequestService {
  static async createSupportRequest(requestData) {
    // Kiểm tra sinh viên có tồn tại
    const student = await StudentModel.findById(requestData.student_id);
    if (!student) {
      throw new Error("Student not found");
    }

    // Kiểm tra request_type_id có tồn tại và active
    const requestType = await SupportRequestModel.findRequestTypeById(
      requestData.request_type_id
    );
    if (!requestType) {
      throw new Error("Invalid or inactive request_type_id");
    }

    // Tạo yêu cầu hỗ trợ
    const requestId = await SupportRequestModel.create(requestData);
    return { request_id: requestId };
  }

  static async getSupportRequests(requestTypeId, requestStatus = null) {
    // Kiểm tra request_type_id có tồn tại
    const requestType = await SupportRequestModel.findRequestTypeById(
      requestTypeId
    );
    if (!requestType) {
      throw new Error("Request type not found");
    }

    // Kiểm tra request_status hợp lệ
    const validStatuses = ["pending", "in_progress", "done"];
    if (requestStatus && !validStatuses.includes(requestStatus)) {
      throw new Error(
        `Invalid request_status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    const requests = await SupportRequestModel.getByTypeAndStatus(
      requestTypeId,
      requestStatus
    );
    return {
      total: requests.length,
      data: requests,
    };
  }

  static async handleSupportRequest(
    requestId,
    requestStatus,
    managerHandleId = null
  ) {
    // Kiểm tra yêu cầu có tồn tại
    const request = await SupportRequestModel.findById(requestId);
    if (!request) {
      throw new Error("Support request not found");
    }

    // Kiểm tra request_status hợp lệ
    const validStatuses = ["pending", "in_progress", "done"];
    if (!validStatuses.includes(requestStatus)) {
      throw new Error(
        `Invalid request_status. Must be one of: ${validStatuses.join(", ")}`
      );
    }

    // Nếu có manager_handle_id, kiểm tra manager có tồn tại
    if (managerHandleId) {
      const manager = await ManagerModel.findById(managerHandleId);
      if (!manager) {
        throw new Error("Manager not found");
      }
    }

    // Update status
    await SupportRequestModel.updateStatus(
      requestId,
      requestStatus,
      managerHandleId
    );

    return {
      request_id: requestId,
      request_status: requestStatus,
      manager_handle_id: managerHandleId || null,
    };
  }
}

export default SupportRequestService;
