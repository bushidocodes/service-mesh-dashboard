import { render } from "@testing-library/react";
import React from "react";
import StyledSVG from "./StyledSVG";

describe("StyledSVG", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<StyledSVG />);
    expect(asFragment()).toMatchSnapshot();
  });
});
