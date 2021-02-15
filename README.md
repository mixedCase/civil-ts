# civil-ts

A TypeScript library for handling civil dates and times.

[Documentation](https://mixedCase.github.io/civil-ts/docs)

## Why

Because representing timezone-independent calendar dates and wall clock time is a different problem than the one solved by the native `Date` object or popular libraries like `Luxon` or `day.js` which represent _absolute points in time_, and thus, it deserves its own separate type and operations.

A common usecase for civil dates and time are scheduled appointments. If two parties agree on meeting at "11:00" and the timezone offset for the territory changes (such as when [Daylight Savings Time](https://en.wikipedia.org/wiki/Daylight_saving_time) kicks in, or the legal body that sets it has a sudden change of heart), the appointment no longer occurs at the same absolute point in time, making Unix timestamps and ISO 8601 datetime strings bad (or at least misleading) choices for representing/storing this agreed upon time.

## Usage examples

```typescript
// This is the way the library was designed to be imported,
// optimizing for code that minimizes stuttering and is easy to
// read and write:
import * as civil from "civil-ts"
// But you can also import from specific modules, if you prefer
// or if your bundler isn't smart enough at tree-shaking:
// import * as civilTime from "civil-ts/time"
// import {
//   CivilDate,
//   equal as civilDateEqual,
//   before,
// } from "civil-ts/date"

const feb28th2021: civil.Date = civil.date.fromObject({
  year: 2021,
  month: 2,
  date: 15,
});
const localDateForNextCronJobExecution = civil.date.fromDate(
  new Date(1623518400000),
});

const plannedlunchTime: civil.Time = civil.time.fromRFC3339PartialTime(
  "12:00:00"
);
const averageActualLunchTime = civil.time.fromRFC3339PartialTime(
  "12:11:03.379"
);

const now: civil.DateTime = civil.dateTime.fromDateLocalTimezone(
  new Date(),
);
const feb28LunchPlansAt = civil.dateTime.fromCivilDateAndTime(
  feb28th2021,
  plannedLunchTime,
);

assert.strictEqual(
  civil.date.toRFC3339FullDate(feb28th2021),
  "2021-02-28",
);

assert.strictEqual(
  civil.date.toDate(feb28th2021).toISOString(),
  // assuming local time zone is UTC
  "2021-02-28T00:00:00.000Z",
);

assert(civil.time.before(plannedLunchTime, averageActualLunchTime))
```

## Status

As of 0.1.0, civil-ts is perfectly usable for representing civil dates and times, as well as basic formatting. Time parsing and validation should be good to go, but Dates only perform basic validation.

## Development

GitHub PRs welcome.

Please make sure to run prettier (the one specified on package.json) with the repo's config on your code, and follow kebab-case for filenames if you need word breaks.

New functionality and behavior changes should include tests. If you intend to make a breaking change, it'd be best to open an issue proposing it before writing any code.

## License

ISC. See LICENSE file.
