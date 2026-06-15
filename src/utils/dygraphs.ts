import { cloneDeep, uniq } from "lodash";

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
export function getDygraphOfValue(metrics, keys) {
  const results: { data: any[]; attributes: any[] } = {
    data: [],
    attributes: []
  };
  if (!metrics || !keys) return results;
  // Not all keys will be present at all times in the metrics object
  const validKeys = keys.filter((key) => Object.keys(metrics).includes(key));
  // Exit with dummy output if none of the keys were in the metrics object
  if (validKeys.length === 0) return results;
  // Or set as the keys of the results object
  // Accumulate all unique timestamps and sort
  const timestamps = validKeys.reduce((acc, key) => {
    return uniq([...acc, ...Object.keys(metrics[key])]).sort(
      (a, b) => Number(a) - Number(b)
    );
  }, []);
  // Map over the timestamps and generate the dygraph format
  results.data = timestamps.map((ts) => {
    return [new Date(Number(ts)), ...validKeys.map((key) => metrics[key][ts])];
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
  dygraph,
  attributesToMap = dygraph.attributes.filter(
    (arr) => arr !== "Time" && arr !== "time"
  )
) {
  return _mapOverDygraphKeys(dygraph, attributesToMap, _netChangeMapper);
}

function _mapOverDygraphKeys(
  outputOfDygraphByValue,
  attributesToMap,
  mapperFunc
) {
  if (!attributesToMap || attributesToMap.length === 0) {
    return outputOfDygraphByValue;
  } else {
    let dygraph = cloneDeep(outputOfDygraphByValue);
    let { data, attributes } = dygraph;
    attributesToMap.forEach((attributeToMap, idx, arr) => {
      const positionOfAttributeToMap = attributes.indexOf(attributeToMap);
      if (positionOfAttributeToMap !== -1) {
        data = data.map((val, i, a) =>
          mapperFunc(val, i, a, positionOfAttributeToMap)
        );
      }
    });
    return { data, attributes };
  }
}

function _netChangeMapper(val, idx, arr, positionOfLabelToMap) {
  if (idx === 0) {
    const result = [...val];
    result[positionOfLabelToMap] = 0;
    return result;
  } else {
    const lastVal = arr[idx - 1][positionOfLabelToMap];
    const lastTime = arr[idx - 1][0];
    const currentVal = val[positionOfLabelToMap];
    const currentTime = val[0];
    const result = [...val];
    const netChange = floatRound(
      (currentVal - lastVal) / ((currentTime - lastTime) / 1000),
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
export function floatRound(val, numberOfDecimalsPlaces) {
  const multiplier = Math.pow(10, numberOfDecimalsPlaces);
  return Math.round(val * multiplier) / multiplier;
}
