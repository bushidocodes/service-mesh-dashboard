import React from "react";
import { render } from "@testing-library/react";
import TableColHeader from "./TableColHeader";

describe("TableColHeader", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableColHeader />);
    expect(asFragment()).toMatchSnapshot();
  });
});
