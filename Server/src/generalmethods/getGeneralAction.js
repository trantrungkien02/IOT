// actionUtils.js
const getGeneralAction = action => {
  switch (action.toLowerCase()) {
    case 'onled':
    case 'onfan':
      return 'ON';
    case 'offled':
    case 'offfan':
      return 'OFF';
    default:
      return action; // hoặc bạn có thể ném lỗi nếu hành động không hợp lệ
  }
};

module.exports = { getGeneralAction };
