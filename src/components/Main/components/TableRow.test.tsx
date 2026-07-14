import { render } from "@testing-library/react";
import React from "react";
import TableRow from "./TableRow";

describe("TableRow", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableRow />);
    expect(asFragment()).toMatchSnapshot();
  });
});
