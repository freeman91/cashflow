import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { cloneDeep } from 'lodash';

dayjs.extend(advancedFormat);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const dateStringToDayJS = (dateString) => {
  return dayjs(dateString?.substring(0, 19) + dateString?.slice(-6));
};

const updateRange = (_range, oldStart, oldEnd) => {
  let range = cloneDeep(_range);
  let newStart = range.start;
  let newEnd = range.end;

  if (oldStart && oldEnd) {
    if (range.start.isBefore(oldStart, 'hour')) {
      if (
        range.end.isSameOrBefore(oldStart, 'hour') ||
        range.end.isBetween((oldStart, oldEnd, 'hour'))
      ) {
        newStart = range.start;
        newEnd = oldEnd;
        range.end = oldStart;
      }
    } else if (
      range.start.isSameOrAfter(oldStart, 'hour') &&
      range.end.isSameOrBefore(oldEnd, 'hour')
    ) {
      return [false, false];
    } else if (range.end.isAfter(oldEnd, 'hour')) {
      if (
        range.start.isSameOrAfter(oldEnd, 'hour') ||
        range.start.isBetween((oldStart, oldEnd, 'hour'))
      ) {
        newEnd = range.end;
        newStart = oldStart;
        range.start = oldEnd;
      }
    }
  }

  return [range, { start: newStart, end: newEnd }];
};

const timeSinceLastUpdate = (lastUpdate) => {
  const now = dayjs();
  const seconds = now.diff(lastUpdate, 'seconds');

  if (seconds < 60) {
    return 'Just now';
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)} minutes ago`;
  } else if (seconds < 86400) {
    return `${Math.floor(seconds / 3600)} hours ago`;
  } else {
    return `${Math.floor(seconds / 86400)} days ago`;
  }
};

export { dateStringToDayJS, updateRange, timeSinceLastUpdate };
