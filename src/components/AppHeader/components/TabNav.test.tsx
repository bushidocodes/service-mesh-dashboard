import { render } from "@testing-library/react";
import React from "react";
import TabNav from "./TabNav";

describe("TabNav", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabNav />);
    expect(asFragment()).toMatchSnapshot();
  });
});
