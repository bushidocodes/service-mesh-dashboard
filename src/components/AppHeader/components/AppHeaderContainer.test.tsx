import { render } from "@testing-library/react";
import React from "react";
import AppHeaderContainer from "./AppHeaderContainer";

describe("AppHeaderContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<AppHeaderContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
