import React from "react";
import { render } from "@testing-library/react";
import TableCol from "./TableCol";

describe("TableCol", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableCol />);
    expect(asFragment()).toMatchSnapshot();
  });
});
