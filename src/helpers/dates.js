import dayjs from 'dayjs';

const dateStringToDayJS = (dateString) => {
  return dayjs(dateString?.substring(0, 19) + dateString?.slice(-6));
};

export { dateStringToDayJS };
