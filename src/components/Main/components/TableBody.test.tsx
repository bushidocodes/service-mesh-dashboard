import { render } from "@testing-library/react";
import React from "react";
import TableBody from "./TableBody";

describe("TableBody", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableBody />);
    expect(asFragment()).toMatchSnapshot();
  });
});
