import React from "react";
import { render } from "@testing-library/react";
import Toolbar from "./Toolbar";

describe("Toolbar", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Toolbar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
