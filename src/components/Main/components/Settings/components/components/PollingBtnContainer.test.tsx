import { render } from "@testing-library/react";
import React from "react";
import PollingBtnContainer from "./PollingBtnContainer";

describe("PollingBtnContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<PollingBtnContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
