import React from "react";
import { render } from "@testing-library/react";
import TabGroup from "./TabGroup";

describe("TabGroup", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabGroup />);
    expect(asFragment()).toMatchSnapshot();
  });
});
