import Qty from "js-quantities";
import { isEmpty } from "./collections";

export const INSTANCE_ID_LENGTH = 8;

/**
 * Takes a lengthy UID and returns a substring of desired length containing the
 * least significant (rightmost) possible characters
 * @param {string} id
 * @param {number} desiredLength
 */
export const trimID = (
  id: string | number | null | undefined,
  desiredLength = INSTANCE_ID_LENGTH
) => {
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
export const convertMS = (ms: number | string = 0) => {
  ms = Number(ms);
  if (Number.isNaN(ms) || typeof ms !== "number" || ms === 0) return [];
  let s = Math.floor(ms / 1000);
  let m = Math.floor(s / 60);
  s = s % 60;
  let h = Math.floor(m / 60);
  m = m % 60;
  let d = Math.floor(h / 24);
  h = h % 24;

  const [dStr, hStr, mStr, sStr] = [d, h, m, s].map((el) => {
    if (el === 0) return "00";
    else if (el < 10) return `0${el}`;
    else return String(el);
  });

  if (dStr !== "00") {
    return [`${dStr}d`, `${hStr}h`, `${mStr}m`, `${sStr}s`];
  } else if (dStr === "00" && hStr !== "00") {
    return [`${hStr}h`, `${mStr}m`, `${sStr}s`];
  } else if (dStr === "00" && hStr === "00" && mStr !== "00") {
    return [`${mStr}m`, `${sStr}s`];
  } else {
    return [`${sStr}s`];
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
export const relativeReqPercent = (
  arrObj: Array<Record<string, unknown>> = [],
  key = ""
) => {
  if (isEmpty(arrObj) || key === "") return arrObj;
  let max = Math.max(...arrObj.map((el) => Number(el[key])));
  // If we can't find a max value, just return the original array of objects
  if (!max) return arrObj;
  return arrObj.map((el) => ({
    ...el,
    relativeReqPercent: (Number(el[key]) / max) * 100
  }));
};

/**
 * Utility function to calculate and format a string containing the error percent
 * of a metric
 * @export
 * @param {number} requests
 * @param {number} errors
 * @returns string
 */
export function calculateErrorPercent(
  requests: number | string,
  errors: number | string
) {
  const requestsNum = Number(requests);
  const errorsNum = Number(errors);
  const errorPercent = requestsNum ? (errorsNum / requestsNum) * 100 : 0;
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
export function formatAsDecimalString(
  source: number | string,
  numberOfDecimals = 3
): string {
  if (source === "") return "";
  const sourceAsNumber = Number(source);
  if (Number.isNaN(sourceAsNumber) || typeof sourceAsNumber !== "number")
    return String(source);

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
  return function (scalar: number | string, units: string) {
    if (scalar === "") return;
    const scalarAsNumber = Number(scalar);
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
export function formatMetricString(
  rawValue: number | string,
  baseUnit?: string,
  resultUnit?: string,
  precision?: number
) {
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
export function blurTableRow(e: { target: EventTarget | null }) {
  let node: Node | null = e.target as Node | null;
  while (node && node !== document.body) {
    if (
      node instanceof HTMLElement &&
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
 * @param {string} string
 * @returns string
 */
export function slugify(string: string) {
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
 * @param {string} serviceName
 * @param {string} serviceVersion
 * @param {function} [slugifyFunc=slugify] - slugify function override intended for testing
 * @returns
 */
export function slugifyMicroservice(
  serviceName: string,
  serviceVersion: string,
  slugifyFunc: (s: string) => string = slugify
) {
  return slugifyFunc(`${serviceName}-v${serviceVersion.replace(/\./g, "-")}`);
}
