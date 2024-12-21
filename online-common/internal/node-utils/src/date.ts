import dayjs from 'dayjs';
import timezone from 'dayjs/plugin/timezone';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import type { Dayjs } from 'dayjs';

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

dayjs.tz.setDefault('Asia/Shanghai');

const dateUtil = dayjs;

export { dateUtil };
export type { Dayjs };
