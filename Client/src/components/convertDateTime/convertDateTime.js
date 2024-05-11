import moment from 'moment';

const convertDateTime = dateTimeString => {
  if (!moment(dateTimeString, moment.ISO_8601).isValid()) {
    return 'Ngày giờ không hợp lệ';
  }

  return moment(dateTimeString).format('YYYY-MM-DD HH:mm:ss');
};

export default convertDateTime;
