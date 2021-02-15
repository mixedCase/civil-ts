export function isBoundedInteger(
  n: number,
  lowerBound: number,
  upperBound: number,
): boolean {
  return Number.isInteger(n) && n >= lowerBound && n <= upperBound;
}
