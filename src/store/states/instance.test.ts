import type { InstanceState, Metrics } from "types";
import instance, { _sliceMetrics, METRICS_CACHE_MAX_SAMPLES } from "./instance";

const staticTimeseriesData: Metrics = {
  money: {
    1509026991398: 4,
    1509027027942: 5,
    1509027054535: 6
  },
  problems: {
    1509026991398: 2,
    1509027027942: 4,
    1509027054535: 8
  },
  timestamps: ["1509026991398", "1509027027942", "1509027054535"]
};

describe("Utility function _sliceMetrics", () => {
  test("trims the oldest timeseries data from all metrics objects", () => {
    expect(_sliceMetrics(staticTimeseriesData)).toEqual({
      money: {
        1509027027942: 5,
        1509027054535: 6
      },
      problems: {
        1509027027942: 4,
        1509027054535: 8
      },
      timestamps: ["1509027027942", "1509027054535"]
    });
  });
});

describe("METRICS_CACHE_MAX_SAMPLES / appendToMetrics ring buffer", () => {
  let now = 1_500_000_000_000;

  beforeEach(() => {
    now = 1_500_000_000_000;
    vi.spyOn(Date, "now").mockImplementation(() => {
      now += 5000;
      return now;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("exports METRICS_CACHE_MAX_SAMPLES as 60 (KD-16)", () => {
    expect(METRICS_CACHE_MAX_SAMPLES).toBe(60);
  });

  test("evicts the oldest timestamp once sample count exceeds the max", () => {
    let state = instance(undefined, { type: "@@INIT" }) as InstanceState;

    // Seed exactly the max number of samples.
    for (let i = 0; i < METRICS_CACHE_MAX_SAMPLES; i++) {
      state = instance(state, {
        type: "appendToMetrics",
        payload: { money: i }
      }) as InstanceState;
    }
    expect(state.metrics.timestamps).toHaveLength(METRICS_CACHE_MAX_SAMPLES);
    const seededTimestamps = state.metrics.timestamps;
    expect(seededTimestamps).toBeDefined();
    const oldestBefore = seededTimestamps![0];
    const newestBefore = seededTimestamps![seededTimestamps!.length - 1];
    expect(oldestBefore).toBeDefined();
    expect(newestBefore).toBeDefined();

    // One more append should evict the oldest and keep length at the max.
    state = instance(state, {
      type: "appendToMetrics",
      payload: { money: 999 }
    }) as InstanceState;

    expect(state.metrics.timestamps).toHaveLength(METRICS_CACHE_MAX_SAMPLES);
    expect(state.metrics.timestamps).not.toContain(oldestBefore);
    expect(state.metrics.timestamps).toContain(newestBefore);
    // Newest sample is present under the money series.
    const timestamps = state.metrics.timestamps;
    expect(timestamps).toBeDefined();
    const latestTs = timestamps![timestamps!.length - 1];
    expect(latestTs).toBeDefined();
    const money = state.metrics.money as Record<string, unknown>;
    expect(money[latestTs!]).toBe(999);
    // Oldest sample's money value is gone.
    expect(money[oldestBefore!]).toBeUndefined();
  });

  test("never grows beyond METRICS_CACHE_MAX_SAMPLES even with many appends", () => {
    let state = instance(undefined, { type: "@@INIT" }) as InstanceState;

    for (let i = 0; i < METRICS_CACHE_MAX_SAMPLES + 25; i++) {
      state = instance(state, {
        type: "appendToMetrics",
        payload: { money: i, problems: i * 2 }
      }) as InstanceState;
    }

    expect(state.metrics.timestamps).toHaveLength(METRICS_CACHE_MAX_SAMPLES);
    // Only the last METRICS_CACHE_MAX_SAMPLES values should remain on each series.
    expect(Object.keys(state.metrics.money as object)).toHaveLength(
      METRICS_CACHE_MAX_SAMPLES
    );
    expect(Object.keys(state.metrics.problems as object)).toHaveLength(
      METRICS_CACHE_MAX_SAMPLES
    );
  });
});
