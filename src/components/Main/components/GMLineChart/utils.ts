import { isEmpty } from "utils/collections";

/**
 * Converts timeseries with time stamps to a string of values without timestamps
 *
 * @param {array} array a timeseries array with time stamps
 * @returns {array}     an array of values
 */
export function numericalTimeSeriesFunc(array: any): any {
  if (array instanceof Array === true && !isEmpty(array)) {
    return array.map((cell) => cell[1]);
  } else {
    return 0;
  }
}

/**
 * Produces an average of array of values
 *
 * @param {array} array an array of values
 * @returns {number}
 */
export function average(array: any) {
  if (array instanceof Array === true && !isEmpty(array)) {
    return array.reduce((a, b) => a + b) / array.length;
  } else {
    return 0;
  }
}

/**
 * Produces a median of array of values
 * (if no middle value, average of 2 most central values is returned)
 *
 * @param {array} array an array of values
 * @returns {number}
 */
export function median(array: any) {
  if (array instanceof Array === true && !isEmpty(array)) {
    const len = array.length;
    let median = 0;
    array.sort();

    if (len % 2 === 0) {
      // if even, average of two middle numbers
      median = (array[len / 2 - 1] + array[len / 2]) / 2;
    } else {
      // if odd, middle number only
      median = array[(len - 1) / 2];
    }
    return median;
  } else {
    return 0;
  }
}

/**
 * Produces a mode(s) of array of values
 * if more than one mode, returns all applicable modes as well as their frequency
 *
 * @param {array} array an array of values
 * @returns {array}     an array that contains mode(s) and frequency value
 */
export function modes(array: any): any {
  if (array instanceof Array === true && !isEmpty(array)) {
    let modes: any = [];
    let count: number[] = [];
    let i;
    let number;
    let maxIndex = 0;

    for (let i = 0; i < array.length; i++) {
      number = array[i];
      count[number] = (count[number] || 0) + 1;
      if (count[number] > maxIndex) {
        maxIndex = count[number];
      }
    }

    for (i in count)
      if (Object.hasOwn(count, i)) {
        if (count[i] === maxIndex) {
          modes.push(Number(i));
        }
      }

    modes.push({ frequency: maxIndex });

    if (maxIndex > 1) {
      return modes;
    } else {
      modes = "no value occurs more than once";
      return modes;
    }
  } else {
    return 0;
  }
}

/**
 * Produces a string that contains descriptive statistics of the graph
 *
 * @param {array} timeSeries an array of values
 * @param {string} title chart title
 * @returns {string}     returns a string with summary chart statistics
 */
export function screenReaderGraphDescription(
  timeSeries: any,
  title: any,
  intl: any
) {
  const numericalTimeSeries = numericalTimeSeriesFunc(timeSeries);

  // We don't have negative values in our charts, thus average of 0 means that all values are 0, aka no meaningful data
  if (average(numericalTimeSeries) > 0) {
    let screenReaderGraphData = {
      median: median(numericalTimeSeries).toFixed(2),
      average: average(numericalTimeSeries).toFixed(2),
      mode: modes(numericalTimeSeries),
      max: numericalTimeSeries.sort().at(-1),
      min: numericalTimeSeries.sort()[0],
      dataPoints: numericalTimeSeries.length,
      // react-intl v3+ formatMessage returns an array when a `values` entry
      // is itself an array (it now supports rich-text values that mix React
      // elements with strings). The screen-reader description must be a
      // single string, so pre-join the time-series numbers here.
      timeSeries: numericalTimeSeries.join(","),
      title
    };

    if (
      typeof screenReaderGraphData.mode !== "string" &&
      screenReaderGraphData.mode.length > 1
    ) {
      screenReaderGraphData = {
        ...screenReaderGraphData,
        mode: `Mode has frequency of ${
          screenReaderGraphData.mode.pop().frequency
        } and values of ${screenReaderGraphData.mode}`
      };
    }

    return intl.formatMessage(
      {
        id: "GMLineChart.screenReaderGraphDescription.withData",
        defaultMessage:
          "A tabular representation of the {title} chart data: median {median} average {average} mode {mode} maximum {max} minimum {min} number of observations {dataPoints} complete data time series follows {timeSeries}",
        description: "Screen reader description for GMLineChart"
      },
      screenReaderGraphData
    );
  } else {
    return intl.formatMessage({
      id: "GMLineChart.screenReaderGraphDescription.noData",
      defaultMessage: `The average for currently displayed data is equal to 0.`,
      description: "Screen reader description for GMLineChart"
    });
  }
}
