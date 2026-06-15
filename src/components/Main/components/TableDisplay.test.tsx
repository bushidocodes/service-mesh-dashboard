import React from "react";
import { render } from "@testing-library/react";
import TableDisplay from "./TableDisplay";

describe("TableDisplay", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableDisplay />);
    expect(asFragment()).toMatchSnapshot();
  });
});
