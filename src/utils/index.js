import _ from "lodash";
import Qty from "js-quantities";

export const INSTANCE_ID_LENGTH = 8;

/**
 * Takes a lengthy UID and returns a substring of desired length containing the
 * least significant (rightmost) possible characters
 * @param {string} id
 * @param {number} desiredLength
 */
export const trimID = (id, desiredLength = INSTANCE_ID_LENGTH) => {
  if (!id) return "";
  const strID = String(id);
  if (!desiredLength || desiredLength >= strID.length) return strID;
  return strID.slice(strID.length - desiredLength);
};

/**
 * Clears the interval with the ID stored at window.refreshFabricIntervalID and then
 * wipes window.refreshFabricIntervalID
 */
export function clearFabricIntervalIfNeeded() {
  if (window.refreshFabricIntervalID) {
    clearInterval(window.refreshFabricIntervalID);
    window.refreshFabricIntervalID = null;
  }
}
/**
 * Takes milliseconds and returns a human readable string of time.
 * The string values are split by space to allow the most significant
 * unit to be styled differently
 * 7620940771 => ['88d', '04h', '55m', '41s']
 * @param {(number|string)} ms
 * @returns {string[]}
 */
export const convertMS = (ms = 0) => {
  ms = _.toNumber(ms);
  if (_.isNaN(ms) || typeof ms !== "number" || ms === 0) return [];
  let s = Math.floor(ms / 1000);
  let m = Math.floor(s / 60);
  s = s % 60;
  let h = Math.floor(m / 60);
  m = m % 60;
  let d = Math.floor(h / 24);
  h = h % 24;

  [d, h, m, s] = [d, h, m, s].map((el) => {
    if (el === 0) return "00";
    else if (el < 10) return `0${el}`;
    else return el;
  });

  if (d !== "00") {
    return [`${d}d`, `${h}h`, `${m}m`, `${s}s`];
  } else if (d === "00" && h !== "00") {
    return [`${h}h`, `${m}m`, `${s}s`];
  } else if (d === "00" && h === "00" && m !== "00") {
    return [`${m}m`, `${s}s`];
  } else {
    return [`${s}s`];
  }
};

/**
 * Takes an array of objects, inspects the value of a particular key for each object, and then
 * calculates the relative value of each object as a percentage of the object with the highest
 * value of this particular key. Each object is appended with the key 'relativeReqPercent' containing a float value expressing a percentage between 0 and 1000.
 *
 * For example, if Route A has 1000 requests per second, Route B has 500 requests per second, and Route C has 10 requests per second, Route A's bar is at 100%, Route B's bar is at 50%, and Route C's bar is at 1%.
 *
 * While the algorithm is reusable, this utillity function currently hardcodes the 'relativeReqPercent'
 * key, which refers to the original use of this function with request count metrics. This can be refactored
 * to dynamically generate a key based on the source key passed into the function.
 *
 * @param {Object[]} arrObj - An array of Objects containing keys
 * @param {string} key - The key that we want to use to compare the objects
 * @returns {Object[]} - The array of objects, where each object now contains the relativeReqPercent key
 */
export const relativeReqPercent = (arrObj = [], key = "") => {
  if (_.isEmpty(arrObj) || key === "") return arrObj;
  let max = _.max(_.map(arrObj, key));
  // If we can't find a max value, just return the original array of objects
  if (!max) return arrObj;
  return _.map(arrObj, (el) =>
    _.extend({}, el, { relativeReqPercent: (el[key] / max) * 100 })
  );
};

/**
 * Utility function to calculate and format a string containing the error percent
 * of a metric
 * @export
 * @param {number} requests
 * @param {number} errors
 * @returns string
 */
export function calculateErrorPercent(requests, errors) {
  const errorPercent = requests ? (errors / requests) * 100 : 0;
  return formatAsDecimalString(errorPercent);
}

/**
 * Utility function to turn a string or number into a number with a precise number of decimals
 * The number is expressed as a localeString inferred from the browser environment to internationalize
 * the result (e.g. 100,000.000 in US or 100.000,000 in Germany)
 * @export
 * @param {(number|string)} number
 * @param {number} numberOfDecimals
 * @returns string
 */
export function formatAsDecimalString(source, numberOfDecimals = 3) {
  if (source === "") return source;
  const sourceAsNumber = _.toNumber(source);
  if (_.isNaN(sourceAsNumber) || typeof sourceAsNumber !== "number")
    return source;

  return sourceAsNumber.toLocaleString(undefined, {
    maximumFractionDigits: numberOfDecimals,
    minimumFractionDigits: 0
  });
}

/**
 * Functionally similar to formatAsDecimalString, but refactored to be a function
 * factor that we can pass into the js-quantities format function
 * @param {number} [maxDecimals=3]
 * @returns
 */
function formatAsDecimalStringFormatter(maxDecimals = 3) {
  return function (scalar, units) {
    if (scalar === "") return;
    const scalarAsNumber = _.toNumber(scalar);
    return `${scalarAsNumber.toLocaleString(undefined, {
      maximumFractionDigits: maxDecimals,
      minimumFractionDigits: 0
    })} ${units}`;
  };
}

/**
 * function that wraps js-quantities and allows for conversion between units
 * and rounding to a desired unit of precision
 * @export
 * @param {number} rawValue
 * @param {string} baseUnit
 * @param {string} resultUnit
 * @param {number} precision
 * @returns string
 */
export function formatMetricString(rawValue, baseUnit, resultUnit, precision) {
  if (baseUnit && resultUnit && (precision || precision === 0)) {
    const qty = Qty(rawValue, baseUnit);
    const result = qty
      .to(resultUnit)
      .format(formatAsDecimalStringFormatter(precision))
      .toString();
    return result;
  } else if (precision || precision === 0) {
    const result = Qty(rawValue)
      .format(formatAsDecimalStringFormatter(precision))
      .toString();
    return result;
  } else {
    return Qty(rawValue).format(formatAsDecimalStringFormatter()).toString();
  }
}

/**
 * Utility function used in table rows to manage focus state. This is accomplished
 * by searching up the DOM tree to find table row and take away its focus to prevent outline
 * on click while preserving tabbing outline
 * @export
 * @param {Object} e
 */
export function blurTableRow(e) {
  let node = e.target;
  while (node && node !== document.body) {
    if (
      typeof node.className === "string" &&
      node.className.includes("TableRow")
    ) {
      node.blur();
      return;
    }
    node = node.parentNode;
  }
}

/**
 * Takes a string and generates a basic slug, ignoring unicode characters and emojis
 * @export
 * @param {any} string
 * @returns string
 */
export function slugify(string) {
  return string
    .replace(/\s/g, "-")
    .replace(/[()=:.,!#$@"'/|?*+&[\]]/g, "")
    .replace(/^-+|-+$/g, "")
    .replace(/-+/g, "-")
    .toLowerCase();
}

/**
 * Takes a service name and version and combines them together
 * prior to passing the result to a slugify function
 *
 * @export
 * @param {any} serviceName
 * @param {any} serviceVersion
 * @param {any} [slugifyFunc=slugify] - slugify function override intended for testing
 * @returns
 */
export function slugifyMicroservice(
  serviceName,
  serviceVersion,
  slugifyFunc = slugify
) {
  return slugifyFunc(`${serviceName}-v${serviceVersion.replace(".", "-")}`);
}
