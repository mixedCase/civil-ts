import * as civilDate from "./date";
import { CivilDate, CivilDateConstructorObject } from "./date";

const tupleConsToObj = ([
  year,
  month,
  date,
]: number[]): CivilDateConstructorObject => ({
  year,
  month,
  date,
});

type Match = {
  year: number;
  month: number;
  date: number;
};

describe("civilDate.fromObject", () => {
  it("should build CivilDates when correct values are used", () => {
    [
      [2021, 2, 14],
      [500, 12, 31],
      [1, 1, 1],
      [2077, 1, 1],
      [1899, 12, 31],
      [2019, 2, 28],
      [1984, 8, 30],
    ]
      .map(tupleConsToObj)
      .forEach((obj) => {
        const cd = civilDate.fromObject(obj);
        expect(cd).toMatchObject({
          year: obj.year,
          month: obj.month,
          date: obj.date,
        });
      });
  });

  it("errors when invalid data is fed to it", () => {
    expect(() =>
      civilDate.fromObject({
        year: 1.1,
        month: 10,
        date: 20,
      }),
    ).toThrowError("Year value should be an integer");

    [
      [2020, 0, 15],
      [2020, 13, 15],
      [2020, 2.2, 15],
    ]
      .map(tupleConsToObj)
      .forEach((obj) => {
        expect(() => civilDate.fromObject(obj)).toThrowError(
          "Month value should be an integer between 1 and 12",
        );
      });

    [
      [2020, 10, 0],
      [2020, 12, 32],
      [2020, 8, 15.00000001],
    ]
      .map(tupleConsToObj)
      .forEach((obj) => {
        expect(() => civilDate.fromObject(obj)).toThrowError(
          "Date value should be an integer between 1 and 31",
        );
      });
  });
});

describe("civilDate.fromDateLocalTimezone", () => {
  it("should build CivilDates from Dates' regular values", () => {
    const date = new Date(2021, 0, 2);
    expect(civilDate.fromDateLocalTimezone(date)).toMatchObject({
      year: 2021,
      month: 1,
      date: 2,
    });
  });
});

describe("civilDate.fromDateUTC", () => {
  it("should build CivilDates from Dates' UTC values", () => {
    ([
      [Date.UTC(2020, 6, 3, 0, 0, 0, 0), { year: 2020, month: 7, date: 3 }],
      [Date.UTC(2021, 2, 4, 23, 0, 0, 0), { year: 2021, month: 3, date: 4 }],
    ] as Array<[number, Match]>).forEach(([ts, match]) => {
      expect(civilDate.fromDateUTC(new Date(ts))).toMatchObject(match);
    });
  });
});

describe("civilDate.fromRFC3339FullDate", () => {
  it("should build CivilDates from correct full-date strings", () => {
    ([
      ["2020-10-24", { year: 2020, month: 10, date: 24 }],
      ["1918-11-11", { year: 1918, month: 11, date: 11 }],
      ["500-02-03", { year: 500, month: 2, date: 3 }],
      ["22-04-23", { year: 22, month: 4, date: 23 }],
    ] as Array<[string, Match]>).forEach(([str, match]) => {
      expect(civilDate.fromRFC3339FullDate(str)).toMatchObject(match);
    });
  });

  it("errors when invalid strings are fed to it", () => {
    expect(() => civilDate.fromRFC3339FullDate("2021.32-10-02")).toThrowError(
      "Year value should be an integer",
    );

    ["2020-00-15", "2020-13-15", "2020-2.2-15"].forEach((str) => {
      expect(() => civilDate.fromRFC3339FullDate(str)).toThrowError(
        "Month value should be an integer between 1 and 12",
      );
    });

    ["2020-10-0", "2020-12-32", "2020-8-15.00000001"].forEach((str) => {
      expect(() => civilDate.fromRFC3339FullDate(str)).toThrowError(
        "Date value should be an integer between 1 and 31",
      );
    });
  });
});

describe("civilDate.toDate", () => {
  it("should build Dates from CivilDates", () => {
    [
      [2021, 2, 14],
      [500, 12, 31],
      [2077, 1, 1],
      [1899, 12, 31],
      [2019, 2, 28],
      [1984, 8, 30],
    ]
      .map((tuple) => civilDate.fromObject(tupleConsToObj(tuple)))
      .forEach((cd) => {
        const d = civilDate.toDate(cd);
        expect(d.getFullYear()).toBe(cd.year);
        expect(d.getMonth()).toBe(cd.month - 1);
        expect(d.getDate()).toBe(cd.date);
      });
  });
});

describe("civilDate.toRFC3339FullDate", () => {
  it("should format CivilDates into correct RFC 3339 full-date ", () => {
    ([
      [[2021, 2, 14], "2021-02-14"],
      [[500, 12, 31], "500-12-31"],
      [[1, 1, 1], "01-01-01"],
      [[2077, 1, 1], "2077-01-01"],
      [[1899, 12, 31], "1899-12-31"],
      [[2019, 2, 28], "2019-02-28"],
      [[1984, 8, 30], "1984-08-30"],
    ] as Array<[number[], string]>)
      .map(([tuple, strMatch]): [CivilDate, string] => [
        civilDate.fromObject(tupleConsToObj(tuple)),
        strMatch,
      ])
      .forEach(([cd, strMatch]) => {
        expect(civilDate.toRFC3339FullDate(cd)).toMatch(strMatch);
      });
  });
});

describe("civilDate.equal", () => {
  it("should return whether two CivilDates are equal or not", () => {
    ([
      [[2021, 2, 14], "2021-02-14"],
      [[500, 12, 31], "500-12-31"],
      [[1, 1, 1], "01-01-01"],
      [[2077, 1, 1], "2077-01-01"],
      [[1899, 12, 31], "1899-12-31"],
      [[2019, 2, 28], "2019-02-28"],
      [[1984, 8, 30], "1984-08-30"],
    ] as Array<[number[], string]>)
      .map(([tuple, str]) => ({
        cd1: civilDate.fromObject(tupleConsToObj(tuple)),
        cd2: civilDate.fromRFC3339FullDate(str),
      }))
      .forEach(({ cd1, cd2 }) => {
        expect(civilDate.equal(cd1, cd2)).toBe(true);
      });

    ([
      [[2021, 2, 14], "2020-02-14"],
      [[500, 12, 31], "500-11-31"],
      [[1, 1, 1], "01-01-02"],
      [[2077, 1, 1], "2077-03-02"],
      [[1899, 12, 31], "1898-02-21"],
    ] as Array<[number[], string]>)
      .map(([tuple, str]) => ({
        cd1: civilDate.fromObject(tupleConsToObj(tuple)),
        cd2: civilDate.fromRFC3339FullDate(str),
      }))
      .forEach(({ cd1, cd2 }) => {
        expect(civilDate.equal(cd1, cd2)).toBe(false);
      });
  });
});

describe("civilDate.before and civilDate.after", () => {
  it("can compare CivilDates properly", () => {
    ([
      ["2020-01-02", "2020-01-03"],
      ["500-01-03", "500-11-02"],
      ["1980-11-02", "1980-11-03"],
      ["1320-11-02", "1320-12-01"],
      ["1320-01-03", "1321-01-03"],
      ["2020-08-08", "2021-08-08"],
    ] as Array<[string, string]>)
      .map(([str1, str2]) => ({
        cd1: civilDate.fromRFC3339FullDate(str1),
        cd2: civilDate.fromRFC3339FullDate(str2),
      }))
      .forEach(({ cd1, cd2 }) => {
        expect(civilDate.before(cd1, cd2)).toBe(true);
        expect(civilDate.before(cd2, cd1)).toBe(false);

        expect(civilDate.after(cd2, cd1)).toBe(true);
        expect(civilDate.after(cd1, cd2)).toBe(false);

        expect(civilDate.before(cd1, cd1)).toBe(false);
        expect(civilDate.before(cd2, cd2)).toBe(false);
        expect(civilDate.after(cd1, cd1)).toBe(false);
        expect(civilDate.after(cd2, cd2)).toBe(false);
      });
  });
});
