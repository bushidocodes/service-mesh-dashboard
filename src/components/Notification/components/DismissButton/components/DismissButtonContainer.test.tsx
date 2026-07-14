import { render } from "@testing-library/react";
import React from "react";
import DismissButtonContainer from "./DismissButtonContainer";

describe("DismissButtonContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DismissButtonContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
