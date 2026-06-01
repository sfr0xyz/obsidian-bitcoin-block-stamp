import { isDeepStrictEqual } from 'node:util';

export function equal<T> (actual: T, expected: T): void {
  if (!Object.is(actual, expected)) {
    throw new Error(`Expected ${String(expected)}, got ${String(actual)}`);
  }
}

export function deepEqual<T> (actual: T, expected: T): void {
  if (!isDeepStrictEqual(actual, expected)) {
    throw new Error(`Expected ${JSON.stringify(expected)}, got ${JSON.stringify(actual)}`);
  }
}
