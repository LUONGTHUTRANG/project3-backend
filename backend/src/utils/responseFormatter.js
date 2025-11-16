// Định dạng phản hồi thành công
export function successResponse(data, message = "Success") {
  return {
    success: true,
    message,
    data,
  };
}

// Định dạng phản hồi lỗi
export function errorResponse(message, statusCode = 500) {
  return {
    success: false,
    message,
    statusCode,
  };
}

// Định dạng danh sách với phân trang
export function paginatedResponse(data, total, page = 1, limit = 10) {
  return {
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
}
