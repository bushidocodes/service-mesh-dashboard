/**
 * Small, dependency-free reimplementations of the handful of lodash@4 helpers
 * the dashboard relied on. These replace the `lodash` dependency with vanilla
 * JS/TS. Each function mirrors lodash semantics closely enough for the call
 * sites in this repo — intentional simplifications are noted per function.
 *
 * The trivial lodash helpers (`map`, `values`, `keys`, `toPairs`, `includes`,
 * `toNumber`, `isNaN`, `last`, `assign`, `extend`, `cloneDeep`, …) were inlined
 * at their call sites with native equivalents and are not re-exported here.
 */

export type SortOrder = "asc" | "desc";
type Iteratee<T> = ((item: T) => unknown) | string;

function toGetter<T>(iteratee: Iteratee<T>): (item: T) => unknown {
  return typeof iteratee === "function"
    ? iteratee
    : (item: T) => (item as Record<string, unknown>)[iteratee];
}

/**
 * Compares two values the way lodash's default ascending comparator does:
 * `null`/`undefined` sort last, `NaN` sorts after real numbers, numbers compare
 * numerically, and everything else compares as strings.
 */
function compareAscending(a: unknown, b: unknown): number {
  if (a === b) return 0;
  const aNil = a === undefined || a === null;
  const bNil = b === undefined || b === null;
  if (aNil || bNil) return aNil ? (bNil ? 0 : 1) : -1;
  if (typeof a === "number" && typeof b === "number") {
    if (Number.isNaN(a)) return Number.isNaN(b) ? 0 : 1;
    if (Number.isNaN(b)) return -1;
    return a < b ? -1 : 1;
  }
  const as = String(a);
  const bs = String(b);
  return as < bs ? -1 : as > bs ? 1 : 0;
}

/**
 * lodash-compatible `orderBy`: sorts a collection by one or more iteratees
 * (property names or accessor functions) with a matching list of sort orders.
 * Returns a new array; native `Array.prototype.sort` is stable, matching lodash.
 */
export function orderBy<T>(
  collection: readonly T[] | null | undefined,
  iteratees: Iteratee<T> | Iteratee<T>[],
  orders?: SortOrder | readonly SortOrder[]
): T[] {
  if (collection == null) return [];
  const getters = (Array.isArray(iteratees) ? iteratees : [iteratees]).map(
    toGetter
  );
  const orderList = Array.isArray(orders) ? orders : orders ? [orders] : [];
  return [...collection].sort((a, b) => {
    for (let i = 0; i < getters.length; i++) {
      const cmp = compareAscending(getters[i](a), getters[i](b));
      if (cmp !== 0) return orderList[i] === "desc" ? -cmp : cmp;
    }
    return 0;
  });
}

/**
 * lodash-compatible `has`: true when `object` contains the (optionally nested,
 * dot-delimited) `path` as an own property at every level.
 */
export function has(object: unknown, path: string): boolean {
  let current: unknown = object;
  for (const segment of path.split(".")) {
    if (
      current == null ||
      typeof current !== "object" ||
      !Object.prototype.hasOwnProperty.call(current, segment)
    ) {
      return false;
    }
    current = (current as Record<string, unknown>)[segment];
  }
  return true;
}

/** lodash-compatible `pick`: a shallow copy of `object` with only `keys` that exist. */
export function pick<T>(
  object: Record<string, T>,
  keys: readonly string[]
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const key of keys) {
    if (Object.prototype.hasOwnProperty.call(object, key)) {
      result[key] = object[key];
    }
  }
  return result;
}

/** lodash-compatible `omit`: a shallow copy of `object` without the given key(s). */
export function omit<T>(
  object: Record<string, T>,
  keys: string | number | ReadonlyArray<string | number>
): Record<string, T> {
  const exclude = new Set(
    (Array.isArray(keys) ? keys : [keys]).map((key) => String(key))
  );
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(object)) {
    if (!exclude.has(key)) result[key] = value;
  }
  return result;
}

/** lodash-compatible `omitBy`: a shallow copy of `object` minus entries the predicate accepts. */
export function omitBy<T>(
  object: Record<string, T>,
  predicate: (value: T, key: string) => boolean
): Record<string, T> {
  const result: Record<string, T> = {};
  for (const [key, value] of Object.entries(object)) {
    if (!predicate(value, key)) result[key] = value;
  }
  return result;
}

/** lodash-compatible `mapValues`: a new object with each value passed through `iteratee`. */
export function mapValues<T, R>(
  object: Record<string, T>,
  iteratee: (value: T, key: string) => R
): Record<string, R> {
  const result: Record<string, R> = {};
  for (const [key, value] of Object.entries(object)) {
    result[key] = iteratee(value, key);
  }
  return result;
}

/** lodash-compatible `countBy` with the identity iteratee: counts occurrences of each value. */
export function countBy<T>(collection: readonly T[]): Record<string, number> {
  const result: Record<string, number> = {};
  for (const value of collection) {
    const key = String(value);
    result[key] = (result[key] ?? 0) + 1;
  }
  return result;
}

/**
 * lodash-compatible `isEmpty`: true for nullish values, empty
 * strings/arrays/array-likes (e.g. a `NodeList`), empty `Map`/`Set`, objects
 * with no own enumerable keys, and any non-collection primitive.
 */
export function isEmpty(value: unknown): boolean {
  if (value == null) return true;
  if (typeof value === "string" || Array.isArray(value)) {
    return value.length === 0;
  }
  if (value instanceof Map || value instanceof Set) {
    return value.size === 0;
  }
  if (typeof value === "object") {
    const arrayLike = value as { length?: unknown };
    if (typeof arrayLike.length === "number") {
      return arrayLike.length === 0;
    }
    return Object.keys(value).length === 0;
  }
  return true;
}

/** Returns a copy of `array` with duplicate values removed (SameValueZero). */
export function uniq<T>(array: readonly T[]): T[] {
  return [...new Set(array)];
}

/** Returns a copy of `array` excluding all the given `values`. */
export function without<T>(array: readonly T[], ...values: T[]): T[] {
  return array.filter((item) => !values.includes(item));
}

/** Uppercases the first character of `string` (lodash `upperFirst`). */
export function upperFirst(value?: string): string {
  if (!value) return "";
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/**
 * lodash-compatible deep `isEqual` for the plain data this app compares (nested
 * objects, arrays, `Date`s, primitives). Functions — like the freshly-created
 * Dygraph formatter callbacks — compare by reference, matching lodash, so an
 * object carrying a new function instance is reported as changed.
 */
export function isEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  if (typeof a === "number" && typeof b === "number") {
    return Number.isNaN(a) && Number.isNaN(b);
  }
  if (
    a === null ||
    b === null ||
    typeof a !== "object" ||
    typeof b !== "object"
  ) {
    return false;
  }
  if (a instanceof Date || b instanceof Date) {
    return (
      a instanceof Date && b instanceof Date && a.getTime() === b.getTime()
    );
  }
  const aIsArray = Array.isArray(a);
  const bIsArray = Array.isArray(b);
  if (aIsArray !== bIsArray) return false;
  if (aIsArray && bIsArray) {
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (!isEqual(a[i], b[i])) return false;
    }
    return true;
  }
  const aObj = a as Record<string, unknown>;
  const bObj = b as Record<string, unknown>;
  const aKeys = Object.keys(aObj);
  const bKeys = Object.keys(bObj);
  if (aKeys.length !== bKeys.length) return false;
  for (const key of aKeys) {
    if (
      !Object.prototype.hasOwnProperty.call(bObj, key) ||
      !isEqual(aObj[key], bObj[key])
    ) {
      return false;
    }
  }
  return true;
}

/**
 * lodash-compatible `memoize`: caches results keyed by the first argument
 * (lodash's default resolver). The exposed `cache` mirrors lodash's API.
 */
export function memoize<A extends unknown[], R>(
  func: (...args: A) => R
): ((...args: A) => R) & { cache: Map<unknown, R> } {
  const cache = new Map<unknown, R>();
  function memoized(this: unknown, ...args: A): R {
    const key = args[0];
    if (cache.has(key)) {
      return cache.get(key) as R;
    }
    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  }
  memoized.cache = cache;
  return memoized;
}

/**
 * lodash-compatible trailing `debounce`: invokes `func` once `wait` ms have
 * elapsed since the last call. Supports `.cancel()` like lodash's return value.
 */
export function debounce<A extends unknown[]>(
  func: (...args: A) => unknown,
  wait: number
): ((...args: A) => void) & { cancel: () => void } {
  let timer: ReturnType<typeof setTimeout> | undefined;
  function debounced(this: unknown, ...args: A): void {
    if (timer !== undefined) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = undefined;
      func.apply(this, args);
    }, wait);
  }
  debounced.cancel = () => {
    if (timer !== undefined) clearTimeout(timer);
    timer = undefined;
  };
  return debounced;
}
