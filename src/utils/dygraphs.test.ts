import {
  floatRound,
  getDygraphOfValue,
  mapDygraphKeysToNetChange
} from "./dygraphs";
import mock from "json/mockReduxStateMetrics";

describe("getDygraphOfValue", () => {
  test("returns time series data of one or more in Dygraph format", () => {
    let metrics = mock.instance.metrics;
    let keys = ["HTTPS/requests", "HTTP/requests"];

    expect(getDygraphOfValue(metrics, keys)).toEqual({
      data: [
        [new Date("2017-11-14T22:48:14.557Z"), 50, 1193388],
        [new Date("2017-11-14T22:48:19.598Z"), 50, 1193388],
        [new Date("2017-11-14T22:48:24.508Z"), 50, 1193388],
        [new Date("2017-11-14T22:48:29.508Z"), 50, undefined],
        [new Date("2017-11-14T22:48:34.507Z"), 50, undefined]
      ],
      attributes: ["Time", "HTTPS/requests", "HTTP/requests"]
    });
  });
});

describe("mapDygraphKeysToNetChange", () => {
  test("returns net change", () => {
    const dygraphData = {
      data: [
        [new Date("Tue Dec 19 2017 14:03:16 GMT-0500 (EST)"), 1692],
        [new Date("Tue Dec 19 2017 14:03:21 GMT-0500 (EST)"), 1700]
      ],
      attributes: ["Time", "Requests Per Second"]
    };
    const labelsToMap = ["Requests Per Second"];

    expect(mapDygraphKeysToNetChange(dygraphData, labelsToMap)).toEqual({
      data: [
        [new Date("2017-12-19T19:03:16.000Z"), 0],
        [new Date("2017-12-19T19:03:21.000Z"), 1.6]
      ],
      attributes: ["Time", "Requests Per Second"]
    });
  });
});

describe("floatRound", () => {
  test("rounds a number to the number of decimal places specified", () => {
    expect(floatRound(Math.PI, 2)).toEqual(3.14);
  });
});
