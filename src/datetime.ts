/**
 * @since 0.1.0
 */
import { CivilDate, CivilDateConstructorObject } from "./date";
import * as civilDate from "./date";
import { CivilTime, CivilTimeConstructorObject } from "./time";
import * as civilTime from "./time";

/**
 * @since 0.1.0
 */
export type CivilDateTimeConstructorObject = CivilDateConstructorObject &
  CivilTimeConstructorObject;

/**
 * @since 0.1.0
 */
export class CivilDateTime {
  private constructor(
    public readonly date: CivilDate,
    public readonly time: CivilTime,
  ) {}

  public static fromCivilDateAndTime(date: CivilDate, time: CivilTime) {
    return new CivilDateTime(date, time);
  }

  public static fromObject(obj: CivilDateTimeConstructorObject): CivilDateTime {
    return new CivilDateTime(
      civilDate.fromObject(obj),
      civilTime.fromObject(obj),
    );
  }
}

/**
 * @since 0.1.0
 */
export const fromObject = CivilDateTime.fromObject;

/**
 * @since 0.1.0
 */
export const fromCivilDateAndTime = CivilDateTime.fromCivilDateAndTime;

/**
 * @since 0.1.0
 */
export function fromDateUTC(d: Date): CivilDateTime {
  return fromCivilDateAndTime(
    civilDate.fromDateUTC(d),
    civilTime.fromDateUTC(d),
  );
}

/**
 * @since 0.1.0
 */
export function fromDateLocalTimezone(d: Date): CivilDateTime {
  return fromCivilDateAndTime(
    civilDate.fromDateLocalTimezone(d),
    civilTime.fromDateLocalTimezone(d),
  );
}

/**
 * @since 0.1.0
 */
export function toDate(dt: CivilDateTime): Date {
  return new Date(
    dt.date.year,
    dt.date.month,
    dt.date.date,
    dt.time.hour,
    dt.time.minute,
    dt.time.second,
    dt.time.millisecond,
  );
}

/**
 * @since 0.1.0
 */
export function toString(dt: CivilDateTime, sep = " "): string {
  return (
    civilDate.toRFC3339FullDate(dt.date) +
    sep +
    civilTime.toRFC3339PartialTime(dt.time)
  );
}

/**
 * @since 0.1.0
 */
export function equal(dt1: CivilDateTime, dt2: CivilDateTime): boolean {
  return (
    civilDate.equal(dt1.date, dt2.date) && civilTime.equal(dt1.time, dt2.time)
  );
}

/**
 * @since 0.1.0
 */
export function before(dt1: CivilDateTime, dt2: CivilDateTime): boolean {
  if (civilDate.equal(dt1.date, dt2.date)) {
    return civilTime.before(dt1.time, dt2.time);
  }
  return civilDate.before(dt1.date, dt2.date);
}

/**
 * @since 0.1.0
 */
export function after(dt1: CivilDateTime, dt2: CivilDateTime): boolean {
  return before(dt2, dt1);
}
