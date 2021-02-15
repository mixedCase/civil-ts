import * as civilTime from "./time";
import { CivilTimeConstructorObject } from "./time";

const tupleConsToObj = ([
  hour,
  minute,
  second,
  millisecond,
]: number[]): CivilTimeConstructorObject => ({
  hour,
  minute,
  second,
  millisecond,
});

type Match = {
  hour: number;
  minute: number;
  second: number;
  millisecond: number;
};

describe("civilTime.fromObject", () => {
  it.each(
    [
      [23, 59, 59, 999],
      [23, 59, 59],
      [0, 0, 0, 0],
      [0, 0, 0, 15],
      [0, 0, 0, 150],
      [0, 0, 1, 0],
      [0, 0, 1, 150],
      [0, 1, 0, 150],
      [13, 42, 28, 789],
    ].map(tupleConsToObj),
  )("should build a CivilTime correctly from object %o", (obj) => {
    expect(civilTime.fromObject(obj)).toMatchObject({
      hour: obj.hour,
      minute: obj.minute,
      second: obj.second,
      millisecond: obj.millisecond ?? 0,
    });
  });

  it.each(
    [
      {
        vals: [
          [0.3, 0, 0, 150],
          [-1, 1, 0, 150],
          [24, 42, 28, 789],
        ],
        err: "Hour value should be an integer between 0 and 23",
      },
      {
        vals: [
          [0, 0.2, 0, 15],
          [0, -1, 1, 0],
          [0, 60, 1, 150],
        ],
        err: "Minute value should be an integer between 0 and 59",
      },
      {
        vals: [
          [23, 59, -1],
          [23, 59, 60],
          [0, 0, 0.1, 0],
        ],
        err: "Second value should be an integer between 0 and 59",
      },
      {
        vals: [
          [23, 59, 59, -1],
          [23, 59, 59, 1000],
          [23, 59, 59, 500.1],
        ],
        err: "Millisecond value should be an integer between 0 and 999",
      },
    ]
      .map(({ vals, err }) =>
        vals.map((val): [CivilTimeConstructorObject, string | RegExp] => [
          tupleConsToObj(val),
          err,
        ]),
      )
      .reduce((acc, arrs) => acc.concat(arrs), []),
  )("should error when invalid object %j is passed", (val, err) => {
    expect(() => civilTime.fromObject(val)).toThrowError(err);
  });
});

describe("civilTime.fromDateLocalTimezone", () => {
  it.each([
    [
      new Date(2020, 6, 3, 0, 0, 0, 0),
      { hour: 0, minute: 0, second: 0, millisecond: 0 },
    ],
    [
      new Date(2021, 2, 4, 23, 59, 59, 999),
      { hour: 23, minute: 59, second: 59, millisecond: 999 },
    ],
    [
      new Date(2021, 2, 4, 23, 0, 0, 0),
      { hour: 23, minute: 0, second: 0, millisecond: 0 },
    ],
  ] as Array<[Date, Record<string, number>]>)(
    "should build a CivilTime using regular values from date %j",
    (date, match) => {
      expect(civilTime.fromDateLocalTimezone(date)).toMatchObject(match);
    },
  );
});

describe("civilTime.fromDateUTC", () => {
  it.each([
    [
      Date.UTC(2020, 6, 3, 0, 0, 0, 0),
      { hour: 0, minute: 0, second: 0, millisecond: 0 },
    ],
    [
      Date.UTC(2021, 2, 4, 23, 59, 59, 999),
      { hour: 23, minute: 59, second: 59, millisecond: 999 },
    ],
    [
      Date.UTC(2021, 2, 4, 23, 0, 0, 0),
      { hour: 23, minute: 0, second: 0, millisecond: 0 },
    ],
    [
      Date.UTC(2021, 2, 4, 11, 11, 0, 80),
      { hour: 11, minute: 11, second: 0, millisecond: 80 },
    ],
  ] as Array<[number, Match]>)(
    "should build a CivilTime with the right values from string %s",
    (ts, match) => {
      expect(civilTime.fromDateUTC(new Date(ts))).toMatchObject(match);
    },
  );
});

describe("civilTime.fromRFC3339PartialTime", () => {
  it.each([
    ["23:59:59.999", { hour: 23, minute: 59, second: 59, millisecond: 999 }],
    ["23:59:59", { hour: 23, minute: 59, second: 59, millisecond: 0 }],
    ["00:00:00.000", { hour: 0, minute: 0, second: 0, millisecond: 0 }],
    ["00:00:00.000", { hour: 0, minute: 0, second: 0, millisecond: 0 }],
    ["11:11:00.080", { hour: 11, minute: 11, second: 0, millisecond: 80 }],
    ["11:11:00", { hour: 11, minute: 11, second: 0, millisecond: 0 }],
    ["23:59:60", { hour: 0, minute: 0, second: 0, millisecond: 0 }],
  ] as Array<[string, Match]>)(
    "should build a CivilTime with the right values from string %s",
    (str, match) => {
      expect(civilTime.fromRFC3339PartialTime(str)).toMatchObject(match);
    },
  );

  it.each(
    [
      {
        vals: [
          "20.8:50:12.010",
          "0.3:00:00.150",
          "-1:01:0.150",
          "24:42:28.789",
        ],
        err: "Hour value should be an integer between 0 and 23",
      },
      {
        vals: ["00:0.2:00.015", "00:-1:01.000", "00:60:01.150"],
        err: "Minute value should be an integer between 0 and 59",
      },
      {
        vals: ["23:59:-1", "23:59:61"],
        // err is kind of a lie, we tolerate 60 but we internally
        // convert it so this error doesn't pop up
        err: "Second value should be an integer between 0 and 59",
      },
      {
        vals: ["00:00:0.1.000"],
        err: /.*is not a valid RFC 3339 partial-time: there should only be one millisecond segment.*/,
      },
    ]
      .map(({ vals, err }) =>
        vals.map((val): [string, string | RegExp] => [val, err]),
      )
      .reduce((acc, arrs) => acc.concat(arrs), []),
  )("errors when invalid string %s is fed to it", (val, err) => {
    expect(() => civilTime.fromRFC3339PartialTime(val)).toThrowError(err);
  });
});
