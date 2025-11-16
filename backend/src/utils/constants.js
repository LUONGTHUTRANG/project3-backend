// Các HTTP status codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
};

// Các error messages
export const ERROR_MESSAGES = {
  INVALID_INPUT: "Dữ liệu đầu vào không hợp lệ",
  NOT_FOUND: "Không tìm thấy",
  UNAUTHORIZED: "Không được phép truy cập",
  SERVER_ERROR: "Lỗi server",
  DUPLICATE_ENTRY: "Dữ liệu đã tồn tại",
};

// Các success messages
export const SUCCESS_MESSAGES = {
  CREATED: "Tạo thành công",
  UPDATED: "Cập nhật thành công",
  DELETED: "Xóa thành công",
  RETRIEVED: "Lấy dữ liệu thành công",
};
