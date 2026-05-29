import React from "react";
import { render } from "@testing-library/react";
import TabIcon from "./TabIcon";

describe("TabIcon", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabIcon />);
    expect(asFragment()).toMatchSnapshot();
  });
});
