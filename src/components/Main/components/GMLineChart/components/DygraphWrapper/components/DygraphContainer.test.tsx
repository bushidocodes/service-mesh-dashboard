import { render } from "@testing-library/react";
import React from "react";
import DygraphContainer from "./DygraphContainer";

describe("DygraphContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DygraphContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
