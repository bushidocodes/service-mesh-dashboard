import { render } from "@testing-library/react";
import React from "react";
import TableDrawerCollapse from "./TableDrawerCollapse";

describe("TableDrawerCollapse", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableDrawerCollapse />);
    expect(asFragment()).toMatchSnapshot();
  });
});
