import {
  numericalTimeSeriesFunc,
  median,
  modes,
  average,
  screenReaderGraphDescription
} from "./utils";
import { IntlProvider } from "react-intl";

describe("GMLineChart utils functions", () => {
  test("numericalTimeSeriesFunc produces an array of number", () => {
    const mockTimeSeriesArray = [
      ["timestamp1", 1],
      ["timestamp1", 2],
      ["timestamp1", 3]
    ];
    const expectedOutput = [1, 2, 3];

    expect(numericalTimeSeriesFunc(mockTimeSeriesArray)).toEqual(
      expectedOutput
    );
  });

  test("median produces a median", () => {
    const mockTimeSeriesArray = [1, 2, 3];

    expect(median(mockTimeSeriesArray)).toBe(2);
  });

  test("modes provide a mode with a frequency output", () => {
    const mockTimeSeriesArray = [1, 2, 2, 3];
    const expectedOutput = [2, { frequency: 2 }];

    const mockTimeSeriesArrayNoMode = [1, 2, 3];
    const expectedOutputNoMode = "no value occurs more than once";

    expect(modes(mockTimeSeriesArray)).toEqual(expectedOutput);
    expect(modes(mockTimeSeriesArrayNoMode)).toEqual(expectedOutputNoMode);
  });

  test("average provides a mean", () => {
    const mockTimeSeriesArray = [1, 2, 3];

    expect(average(mockTimeSeriesArray)).toBe(2);
  });

  test("screenReaderGraphDescription provides correct output ", () => {
    const mockTimeSeriesArray = [
      ["timestamp1", 1],
      ["timestamp1", 2],
      ["timestamp1", 3]
    ];
    const mockOutputIfData =
      "A tabular representation of the Chart chart data: median 2.00 average 2.00 mode no value occurs more than once maximum 3 minimum 1 number of observations 3 complete data time series follows 1,2,3";

    const mockTimeSeriesArrayNoData = [
      [
        ["timestamp1", 0],
        ["timestamp1", 0],
        ["timestamp1", 0]
      ],
      1
    ];
    const mockOutputIfNoData =
      "The average for currently displayed data is equal to 0.";

    const intlProvider = new IntlProvider({ locale: "en" }, {});
    const { intl } = intlProvider.getChildContext();

    expect(
      screenReaderGraphDescription(mockTimeSeriesArray, "Chart", intl)
    ).toEqual(mockOutputIfData);
    expect(
      screenReaderGraphDescription(mockTimeSeriesArrayNoData, "Chart", intl)
    ).toEqual(mockOutputIfNoData);
  });
});
