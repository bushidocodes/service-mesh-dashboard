import { render } from "@testing-library/react";
import React from "react";
import TabDetails from "./TabDetails";

describe("TabDetails", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TabDetails />);
    expect(asFragment()).toMatchSnapshot();
  });
});
