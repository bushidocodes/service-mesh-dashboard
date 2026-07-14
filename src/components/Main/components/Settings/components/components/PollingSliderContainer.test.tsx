import { render } from "@testing-library/react";
import React from "react";
import PollingSliderContainer from "./PollingSliderContainer";

describe("PollingSliderContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<PollingSliderContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
