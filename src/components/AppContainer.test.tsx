import { render } from "@testing-library/react";
import React from "react";
import AppContainer from "./AppContainer";

describe("AppContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<AppContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
