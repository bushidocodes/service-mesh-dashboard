import { _sliceMetrics } from "./instance";

const staticTimeseriesData = {
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

describe("Utility function _sliceMetrics", () =>
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
  }));
