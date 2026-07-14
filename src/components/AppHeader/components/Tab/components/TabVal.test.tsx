import { render } from "@testing-library/react";
import React from "react";
import TabVal from "./TabVal";

describe("TabVal", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabVal />);
    expect(asFragment()).toMatchSnapshot();
  });
});
