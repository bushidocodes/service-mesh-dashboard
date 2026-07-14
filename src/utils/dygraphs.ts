import type { Metrics } from "types";
import { uniq } from "./collections";

/** A single timeseries series keyed by UNIX-timestamp strings. */
type MetricSeries = Record<string, number | string | undefined>;

/** One row of Dygraph array data: [Date, ...series values]. */
type DygraphRow = Array<Date | number | string | null | undefined>;

/** Dygraph-shaped payload returned by getDygraphOfValue. */
export interface DygraphData {
  data: DygraphRow[];
  attributes: string[];
}

function asMetricSeries(value: unknown): MetricSeries | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as MetricSeries;
  }
  return null;
}

/**
 * Returns time series data of one or more in Dygraph format
 * Because this format uses nested arrays, this function also returns an
 * array of keys in the position of the associated values
 * Note that this requires all metrics to occur at the same timestamp
 * See http://dygraphs.com/data.html#array
 *
 * @param {Object} metrics - metric
 * @param {String[]} keys - keys that we want to pluck from metrics
 * @returns {Array}
 */
export function getDygraphOfValue(
  metrics: Metrics | null | undefined,
  keys: string[]
): DygraphData {
  const results: DygraphData = {
    data: [],
    attributes: []
  };
  if (!metrics || !keys) return results;
  // Not all keys will be present at all times in the metrics object
  const validKeys = keys.filter((key: string) =>
    Object.keys(metrics).includes(key)
  );
  // Exit with dummy output if none of the keys were in the metrics object
  if (validKeys.length === 0) return results;
  // Or set as the keys of the results object
  // Accumulate all unique timestamps and sort
  const timestamps = validKeys.reduce((acc: string[], key: string) => {
    const series = asMetricSeries(metrics[key]);
    return uniq([...acc, ...Object.keys(series ?? {})]).sort(
      (a, b) => Number(a) - Number(b)
    );
  }, [] as string[]);
  // Map over the timestamps and generate the dygraph format
  results.data = timestamps.map((ts: string) => {
    return [
      new Date(Number(ts)),
      ...validKeys.map((key: string) => {
        const series = asMetricSeries(metrics[key]);
        return series?.[ts];
      })
    ];
  });
  results.attributes = ["Time", ...validKeys];
  return results;
}

/**
 * Returns time series data of one or more in Dygraph format
 * Note that this requires all metrics to occur at the same timestamp
 * See http://dygraphs.com/data.html#array
 *
 * @param {Object[]} dygraphData - valid dygraph data object returned by getDygraphOfValue
 * @param {String[]} keysToMap - keys that we want to map over and change from value to net change
 * @returns {Object[]}
 */
export function mapDygraphKeysToNetChange(
  dygraph: DygraphData,
  attributesToMap: string[] = dygraph.attributes.filter(
    (arr: string) => arr !== "Time" && arr !== "time"
  )
) {
  return _mapOverDygraphKeys(dygraph, attributesToMap, _netChangeMapper);
}

function _mapOverDygraphKeys(
  outputOfDygraphByValue: DygraphData,
  attributesToMap: string[],
  mapperFunc: (
    val: DygraphRow,
    i: number,
    a: DygraphRow[],
    pos: number
  ) => DygraphRow
): DygraphData {
  if (!attributesToMap || attributesToMap.length === 0) {
    return outputOfDygraphByValue;
  } else {
    let dygraph = structuredClone(outputOfDygraphByValue);
    let { data, attributes } = dygraph;
    attributesToMap.forEach((attributeToMap: string) => {
      const positionOfAttributeToMap = attributes.indexOf(attributeToMap);
      if (positionOfAttributeToMap !== -1) {
        data = data.map((val: DygraphRow, i: number, a: DygraphRow[]) =>
          mapperFunc(val, i, a, positionOfAttributeToMap)
        );
      }
    });
    return { data, attributes };
  }
}

function _netChangeMapper(
  val: DygraphRow,
  idx: number,
  arr: DygraphRow[],
  positionOfLabelToMap: number
): DygraphRow {
  if (idx === 0) {
    const result = [...val];
    result[positionOfLabelToMap] = 0;
    return result;
  } else {
    const lastVal = Number(arr[idx - 1][positionOfLabelToMap]);
    const lastTime = arr[idx - 1][0] as Date;
    const currentVal = Number(val[positionOfLabelToMap]);
    const currentTime = val[0] as Date;
    const result = [...val];
    const netChange = floatRound(
      (currentVal - lastVal) /
        ((currentTime.getTime() - lastTime.getTime()) / 1000),
      3
    );
    // Our net change calculation may sometimes generate a negative value. This is
    // undesired from a visual perspective because a chart's net change should never
    // be below zero. If we detect a negative value then return zero to maintain
    // a sane looking chart.
    result[positionOfLabelToMap] = netChange < 0 ? 0 : netChange;
    return result;
  }
}

/**
 * Rounds a number to a certain number of decimal places;
 *
 * @param {number} val
 * @param {number} numberOfDecimalsPlaces
 * @returns
 */
export function floatRound(val: number, numberOfDecimalsPlaces: number) {
  const multiplier = Math.pow(10, numberOfDecimalsPlaces);
  return Math.round(val * multiplier) / multiplier;
}
