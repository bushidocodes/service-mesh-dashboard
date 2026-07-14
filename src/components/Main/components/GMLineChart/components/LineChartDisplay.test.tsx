import { render } from "@testing-library/react";
import React from "react";
import LineChartDisplay from "./LineChartDisplay";

describe("LineChartDisplay", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LineChartDisplay />);
    expect(asFragment()).toMatchSnapshot();
  });
});
