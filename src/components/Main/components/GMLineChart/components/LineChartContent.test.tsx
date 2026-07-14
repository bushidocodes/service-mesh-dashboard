import { render } from "@testing-library/react";
import React from "react";
import LineChartContent from "./LineChartContent";

describe("LineChartContent", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LineChartContent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
