import React from "react";
import { render } from "@testing-library/react";
import TableColArray from "./TableColArray";

describe("TableColArray", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableColArray />);
    expect(asFragment()).toMatchSnapshot();
  });
});
