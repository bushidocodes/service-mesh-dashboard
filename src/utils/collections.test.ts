import {
  countBy,
  debounce,
  has,
  isEmpty,
  isEqual,
  mapValues,
  memoize,
  omit,
  omitBy,
  orderBy,
  pick,
  uniq,
  upperFirst,
  without
} from "./collections";

describe("collections (vanilla lodash replacements)", () => {
  describe("orderBy", () => {
    const data = [
      { name: "b", n: 2 },
      { name: "a", n: 2 },
      { name: "c", n: 1 }
    ];

    test("sorts by a property key ascending", () => {
      expect(orderBy(data, "name", "asc").map((d) => d.name)).toEqual([
        "a",
        "b",
        "c"
      ]);
    });

    test("sorts descending", () => {
      expect(orderBy(data, "name", ["desc"]).map((d) => d.name)).toEqual([
        "c",
        "b",
        "a"
      ]);
    });

    test("supports multiple iteratees (key + accessor) with per-key orders", () => {
      const result = orderBy(data, [(d) => d.n, "name"], ["asc", "asc"]).map(
        (d) => `${d.n}${d.name}`
      );
      expect(result).toEqual(["1c", "2a", "2b"]);
    });

    test("is stable and tolerates null/undefined input", () => {
      expect(orderBy(undefined, "name")).toEqual([]);
      expect(orderBy(null, "name")).toEqual([]);
    });

    test("does not mutate the input array", () => {
      const input = [{ n: 3 }, { n: 1 }];
      orderBy(input, "n", "asc");
      expect(input.map((d) => d.n)).toEqual([3, 1]);
    });
  });

  describe("has", () => {
    test("checks nested dot-delimited paths", () => {
      expect(has({ a: { b: { c: 1 } } }, "a.b.c")).toBe(true);
      expect(has({ a: { b: {} } }, "a.b.c")).toBe(false);
      expect(has({ labels: undefined }, "labels")).toBe(true);
      expect(has({}, "labels")).toBe(false);
      expect(has(null, "a")).toBe(false);
    });
  });

  describe("pick / omit / omitBy", () => {
    test("pick keeps only existing keys", () => {
      expect(pick({ a: 1, b: 2, c: 3 }, ["a", "c", "z"])).toEqual({
        a: 1,
        c: 3
      });
    });

    test("omit removes a single key or a list (coercing numeric keys)", () => {
      expect(omit({ a: 1, b: 2 }, "b")).toEqual({ a: 1 });
      expect(omit({ 1: "x", 2: "y" }, 1)).toEqual({ 2: "y" });
    });

    test("omitBy drops entries the predicate accepts", () => {
      expect(
        omitBy({ a: 1, b: NaN, c: 3 }, (value) => Number.isNaN(value))
      ).toEqual({ a: 1, c: 3 });
    });
  });

  describe("mapValues", () => {
    test("maps each value, exposing the key", () => {
      expect(mapValues({ a: "1", b: "2" }, (v) => Number(v))).toEqual({
        a: 1,
        b: 2
      });
    });
  });

  describe("countBy", () => {
    test("counts occurrences of each value", () => {
      expect(countBy(["Down", "Stable", "Down"])).toEqual({
        Down: 2,
        Stable: 1
      });
    });
  });

  describe("isEmpty", () => {
    test("matches lodash truthiness across types", () => {
      expect(isEmpty(null)).toBe(true);
      expect(isEmpty(undefined)).toBe(true);
      expect(isEmpty("")).toBe(true);
      expect(isEmpty([])).toBe(true);
      expect(isEmpty({})).toBe(true);
      expect(isEmpty(new Map())).toBe(true);
      expect(isEmpty(42)).toBe(true);
      expect(isEmpty("x")).toBe(false);
      expect(isEmpty([1])).toBe(false);
      expect(isEmpty({ a: 1 })).toBe(false);
    });
  });

  describe("uniq / without", () => {
    test("uniq removes duplicates preserving order", () => {
      expect(uniq([1, 1, 2, 3, 2])).toEqual([1, 2, 3]);
    });

    test("without excludes the given values", () => {
      expect(without(["a", "all", "b"], "all")).toEqual(["a", "b"]);
    });
  });

  describe("upperFirst", () => {
    test("uppercases only the first character", () => {
      expect(upperFirst("stable")).toBe("Stable");
      expect(upperFirst("camelCase")).toBe("CamelCase");
      expect(upperFirst(undefined)).toBe("");
    });
  });

  describe("isEqual", () => {
    test("deep-compares plain data", () => {
      expect(
        isEqual({ a: [1, 2], b: { c: 3 } }, { a: [1, 2], b: { c: 3 } })
      ).toBe(true);
      expect(isEqual({ a: 1 }, { a: 2 })).toBe(false);
      expect(isEqual([1, 2], [1, 2, 3])).toBe(false);
      expect(isEqual(NaN, NaN)).toBe(true);
    });

    test("compares functions by reference (like lodash)", () => {
      const fn = () => 1;
      expect(isEqual({ fn }, { fn })).toBe(true);
      expect(isEqual({ fn: () => 1 }, { fn: () => 1 })).toBe(false);
    });
  });

  describe("memoize", () => {
    test("caches by the first argument", () => {
      const spy = vi.fn((a: number, b: number) => a + b);
      const memoized = memoize(spy);
      expect(memoized(1, 2)).toBe(3);
      // Same first arg → cached, second arg ignored (lodash default resolver)
      expect(memoized(1, 99)).toBe(3);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(memoized.cache.has(1)).toBe(true);
    });
  });

  describe("debounce", () => {
    test("invokes once after the wait window, with the latest args", () => {
      vi.useFakeTimers();
      const spy = vi.fn();
      const debounced = debounce(spy, 1000);
      debounced("a");
      debounced("b");
      expect(spy).not.toHaveBeenCalled();
      vi.advanceTimersByTime(1000);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(spy).toHaveBeenCalledWith("b");
      vi.useRealTimers();
    });

    test("cancel prevents a pending invocation", () => {
      vi.useFakeTimers();
      const spy = vi.fn();
      const debounced = debounce(spy, 1000);
      debounced();
      debounced.cancel();
      vi.advanceTimersByTime(1000);
      expect(spy).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
});
