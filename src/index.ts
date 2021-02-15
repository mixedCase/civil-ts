/**
 * # civil-ts
 *
 * ## Crash-course:
 *
 * ```typescript
 * // This is the way the library was designed to be imported,
 * // optimizing for code that minimizes stuttering and is easy to
 * // read and write:
 * import * as civil from "civil-ts"
 * // But you can also import from specific modules, if you prefer
 * // or if your bundler isn't smart enough at tree-shaking:
 * // import * as civilTime from "civil-ts/time"
 * // import {
 * //   CivilDate,
 * //   equal as civilDateEqual,
 * //   before,
 * // } from "civil-ts/date"
 *
 * const feb28th2021: civil.Date = civil.date.fromObject({
 *   year: 2021,
 *   month: 2,
 *   date: 15,
 * });
 * const localDateForNextCronJobExecution = civil.date.fromDate(
 *   new Date(1623518400000),
 * });
 *
 * const plannedlunchTime: civil.Time = civil.time.fromRFC3339PartialTime(
 *   "12:00:00"
 * );
 * const averageActualLunchTime = civil.time.fromRFC3339PartialTime(
 *   "12:11:03.379"
 * );
 *
 * const now: civil.DateTime = civil.dateTime.fromDateLocalTimezone(
 *   new Date(),
 * );
 * const feb28LunchPlansAt = civil.dateTime.fromCivilDateAndTime(
 *   feb28th2021,
 *   plannedLunchTime,
 * );
 *
 * assert.strictEqual(
 *   civil.date.toRFC3339FullDate(feb28th2021),
 *   "2021-02-28",
 * );
 *
 * // assuming local time zone is UTC
 * assert.strictEqual(
 *   civil.date.toDate(feb28th2021).toISOString(),
 *   "2021-02-28T00:00:00.000Z",
 * );
 *
 * assert(civil.time.before(plannedLunchTime, averageActualLunchTime))
 *
 * ```
 *
 * @module
 */

export * as date from "./date";
export { CivilDate as Date } from "./date";
export { CivilDate } from "./date";

export * as time from "./time";
export { CivilTime as Time } from "./time";
export { CivilTime } from "./time";

export * as dateTime from "./datetime";
export { CivilDateTime as DateTime } from "./datetime";
export { CivilDateTime } from "./datetime";
