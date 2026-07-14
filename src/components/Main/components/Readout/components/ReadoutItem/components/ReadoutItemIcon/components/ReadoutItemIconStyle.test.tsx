import { render } from "@testing-library/react";
import React from "react";
import ReadoutItemIconStyle from "./ReadoutItemIconStyle";

describe("ReadoutItemIconStyle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutItemIconStyle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
