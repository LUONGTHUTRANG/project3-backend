// Kiểm tra email hợp lệ
export function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// Kiểm tra số điện thoại hợp lệ (Việt Nam)
export function isValidPhoneNumber(phone) {
  const phoneRegex = /^(0)[0-9]{9}$/;
  return phoneRegex.test(phone);
}

// Kiểm tra MSSV hợp lệ
export function isValidMSSV(mssv) {
  return mssv && mssv.trim().length > 0;
}

// Kiểm tra xem một string có rỗng hay không
export function isEmpty(str) {
  return !str || str.trim().length === 0;
}

// Kiểm tra xem một số có hợp lệ hay không
export function isValidNumber(num) {
  return !isNaN(num) && num !== null && num !== "";
}
