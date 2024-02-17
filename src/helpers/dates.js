import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { cloneDeep } from 'lodash';

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

export { dateStringToDayJS, updateRange };
