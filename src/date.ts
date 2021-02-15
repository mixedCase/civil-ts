/**
 * @since 0.1.0
 */
import { isBoundedInteger } from "./utils";

/**
 * @since 0.1.0
 */
export interface CivilDateConstructorObject {
  year: number;
  month: number;
  date: number;
}

/**
 * Represents a calendar date by its
 * year, month and date (AKA day of month).
 *
 * @since 0.1.0
 */
export class CivilDate {
  public readonly year: number;
  public readonly month: number;
  public readonly date: number;

  private constructor(obj: CivilDateConstructorObject) {
    this.year = obj.year;
    this.month = obj.month;
    this.date = obj.date;
  }

  public static fromObject(obj: CivilDateConstructorObject): CivilDate {
    if (!Number.isInteger(obj.year)) {
      throw new Error("Year value should be an integer");
    } else if (!isBoundedInteger(obj.month, 1, 12)) {
      throw new Error("Month value should be an integer between 1 and 12");
    } else if (!isBoundedInteger(obj.date, 1, 31)) {
      throw new Error("Date value should be an integer between 1 and 31");
    }
    return new CivilDate(obj);
  }
}

/**
 * Attempts to create a `CivilDate` object
 * from a `CivilDateConstructorObject`.
 * @since 0.1.0
 */
export const fromObject = CivilDate.fromObject;

/**
 * Creates a `CivilDate` object from a JavaScript `Date`, using the
 * calendar date corresponding to its internal timestamp under
 * the local timezone.
 *
 * @since 0.1.0
 */
export function fromDateLocalTimezone(d: Date): CivilDate {
  return fromObject({
    year: d.getFullYear(),
    month: d.getMonth() + 1,
    date: d.getDate(),
  });
}

/**
 * Creates a `CivilDate` object from a JavaScript `Date`, using the
 * calendar date corresponding to its internal timestamp under
 * Zulu time (AKA UTC).
 *
 * @since 0.1.0
 */
export function fromDateUTC(d: Date): CivilDate {
  return fromObject({
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    date: d.getUTCDate(),
  });
}

/**
 * Attempts to create a `CivilDate` object from a string using the
 * RFC 3339 full-date format. (e.g. 2021-02-15)
 *
 * @since 0.1.0
 */
export function fromRFC3339FullDate(str: string): CivilDate {
  const splits = str.split("-").map((str) => Number(str));
  if (splits.length !== 3 || splits.find((n) => isNaN(n)) !== undefined) {
    throw new Error(`"${str}" is not a valid RFC 3339 full-date`);
  }
  return fromObject({
    year: splits[0],
    month: splits[1],
    date: splits[2],
  });
}

/**
 * Creates a JavaScript `Date` from a `CivilDate`, assuming it's in
 * the local timezone.
 *
 * @since 0.1.0
 */
export function toDate(d: CivilDate): Date {
  return new Date(d.year, d.month - 1, d.date);
}

/**
 * Formats a `CivilDate` into a string following RFC 3339
 * full-date format. (e.g. 2021-02-15)
 *
 * @since 0.1.0
 */
export function toRFC3339FullDate(d: CivilDate): string {
  const dateFullYear = d.year.toString().padStart(4, "0");
  const dateMonth = d.month.toString().padStart(2, "0");
  const dateMDay = d.date.toString().padStart(2, "0");
  return `${dateFullYear}-${dateMonth}-${dateMDay}`;
}

/**
 * Compares two `CivilDate` objects and returns `true` if they represent
 * the same calendar date, or `false` otherwise.
 *
 * @since 0.1.0
 */
export function equal(d1: CivilDate, d2: CivilDate): boolean {
  return d1.year === d2.year && d1.month === d2.month && d1.date === d2.date;
}

/**
 * Compares two `CivilDate` objects and returns `true` if the first one
 * predates the second one, or `false` otherwise.
 *
 * @since 0.1.0
 */
export function before(d1: CivilDate, d2: CivilDate): boolean {
  return d1.year !== d2.year
    ? d1.year < d2.year
    : d1.month !== d2.month
    ? d1.month < d2.month
    : d1.date < d2.date;
}

/**
 * Compares two `CivilDate` objects and returns `true` if the first one
 * postdates the second one, or `false` otherwise.
 *
 * @since 0.1.0
 */
export function after(d1: CivilDate, d2: CivilDate): boolean {
  return before(d2, d1);
}
