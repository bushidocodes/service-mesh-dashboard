import { render } from "@testing-library/react";
import React from "react";
import Toolbar from "./Toolbar";

describe("Toolbar", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Toolbar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
