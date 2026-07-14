import { render } from "@testing-library/react";
import React from "react";
import TabTitle from "./TabTitle";

describe("TabTitle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabTitle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
