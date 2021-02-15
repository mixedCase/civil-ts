/**
 * @since 0.1.0
 */
import { isBoundedInteger } from "./utils";

/**
 * @since 0.1.0
 */
export interface CivilTimeConstructorObject {
  hour: number;
  minute: number;
  second: number;
  millisecond?: number;
}

/**
 * Represents wall clock time through its hour, minute, second
 * and millisecond components. It's unaware of time zones and
 * leap seconds.
 *
 * @since 0.1.0
 */
export class CivilTime {
  public readonly hour: number;
  public readonly minute: number;
  public readonly second: number;
  public readonly millisecond: number;

  protected constructor(obj: CivilTimeConstructorObject) {
    this.hour = obj.hour;
    this.minute = obj.minute;
    this.second = obj.second;
    this.millisecond = obj.millisecond ?? 0;
  }

  public static fromObject(obj: CivilTimeConstructorObject): CivilTime {
    if (!isBoundedInteger(obj.hour, 0, 23)) {
      throw new Error("Hour value should be an integer between 0 and 23");
    } else if (!isBoundedInteger(obj.minute, 0, 59)) {
      throw new Error("Minute value should be an integer between 0 and 59");
    } else if (!isBoundedInteger(obj.second, 0, 59)) {
      throw new Error("Second value should be an integer between 0 and 59");
    } else if (
      obj.millisecond !== undefined &&
      !isBoundedInteger(obj.millisecond, 0, 999)
    ) {
      throw new Error(
        "Millisecond value should be an integer between 0 and 999",
      );
    }
    return new CivilTime(obj);
  }
}

/**
 * Attempts to create a `CivilTime` object
 * from a `CivilTimeConstructorObject`.
 *
 * @since 0.1.0
 */
export const fromObject = CivilTime.fromObject;

/**
 * Creates a `CivilTime` object from a JavaScript `Date`, using the
 * wall clock time corresponding to its internal timestamp under
 * the local timezone.
 *
 * @since 0.1.0
 */
export function fromDateLocalTimezone(d: Date): CivilTime {
  return fromObject({
    hour: d.getHours(),
    minute: d.getMinutes(),
    second: d.getSeconds(),
    millisecond: d.getMilliseconds(),
  });
}

/**
 * Creates a `CivilTime` object from a JavaScript `Date`, using the
 * wall clock time corresponding to its internal timestamp under
 * Zulu time (AKA UTC).
 *
 * @since 0.1.0
 */
export function fromDateUTC(d: Date): CivilTime {
  return fromObject({
    hour: d.getUTCHours(),
    minute: d.getUTCMinutes(),
    second: d.getUTCSeconds(),
    millisecond: d.getUTCMilliseconds(),
  });
}

/**
 * Attempts to create a `CivilTime` object from a string using the
 * RFC 3339 partial-time format. (e.g. 23:15:23.250)
 * Since partial-time allows for leap seconds and `CivilTime`
 * explicitly does not, this will interpret second 60 as the first
 * second of the following minute, overflowing back to 00:00:00
 * if necessary.
 *
 * @since 0.1.0
 */
export function fromRFC3339PartialTime(str: string): CivilTime {
  const errStr = (reason: string): string =>
    `"${str}" is not a valid RFC 3339 partial-time: ${reason}`;

  const splits = str.split(":");
  if (splits.length !== 3) {
    throw new Error(
      errStr(
        "there should be three segments separated by two colons (e.g. 15:46:39.123)",
      ),
    );
  }
  const secondAndMaybeSecFrac = splits[2].split(".");
  if (secondAndMaybeSecFrac.length > 2) {
    throw new Error(
      errStr("there should only be one millisecond segment (e.g. 15:46:39.123"),
    );
  }

  const hour = Number(splits[0]);
  const minute = Number(splits[1]);
  const second = Number(secondAndMaybeSecFrac[0]);
  const secFracStr: string | undefined = secondAndMaybeSecFrac[1];
  const secFrac = secFracStr !== undefined ? Number(secFracStr) : undefined;

  const constructorObj = ((): CivilTimeConstructorObject => {
    if (second === 60) {
      // Leap second, which CivilTime does not account for,
      // it being wall clock and RFC 3339 partial-time being
      // usable for absolute points in time.
      const newMinute = minute === 59 ? 0 : minute + 1;
      const newHour = newMinute !== 0 ? hour : hour === 23 ? 0 : hour + 1;
      return {
        hour: newHour,
        minute: newMinute,
        second: 0,
        millisecond: secFrac,
      };
    }
    return {
      hour,
      minute,
      second,
      millisecond: secFrac,
    };
  })();

  try {
    return fromObject(constructorObj);
  } catch (e: any) {
    throw new Error(errStr(e.message || "unidentifiable reason"));
  }
}

/**
 * Formats a `CivilTime` into a string following RFC 3339
 * partial-time format. (e.g. 23:15:23.250)
 *
 * @since 0.1.0
 */
export function toRFC3339PartialTime(t: CivilTime): string {
  const timeHour = t.hour.toString().padStart(2, "0");
  const timeMinute = t.minute.toString().padStart(2, "0");
  const timeSecond = t.second.toString().padStart(2, "0");
  const timeSecFrac = `.` + t.millisecond.toString();
  return `${timeHour}:${timeMinute}:${timeSecond}${timeSecFrac}`;
}

/**
 * Compares two `CivilTime` objects and returns `true` if they represent
 * the same wall clock time, or `false` otherwise.
 *
 * @since 0.1.0
 */
export function equal(t1: CivilTime, t2: CivilTime): boolean {
  return (
    t1.hour === t2.hour &&
    t1.minute == t2.minute &&
    t1.second == t2.second &&
    t1.millisecond == t2.millisecond
  );
}

/**
 * Compares two `CivilTime` objects and returns `true` if the first one
 * predates the second one, or `false` otherwise.
 *
 * @since 0.1.0
 */
export function before(t1: CivilTime, t2: CivilTime): boolean {
  return t1.hour !== t2.hour
    ? t1.hour < t2.hour
    : t1.minute !== t2.minute
    ? t1.minute < t2.minute
    : t1.second !== t2.second
    ? t1.second < t2.second
    : t1.millisecond < t2.millisecond;
}

/**
 * Compares two `CivilTime` objects and returns `true` if the first one
 * postdates the second one, or `false` otherwise.
 *
 * @since 0.1.0
 */
export function after(t1: CivilTime, t2: CivilTime): boolean {
  return before(t2, t1);
}
