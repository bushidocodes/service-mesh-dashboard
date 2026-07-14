import { render } from "@testing-library/react";
import React from "react";
import TableCol from "./TableCol";

describe("TableCol", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableCol />);
    expect(asFragment()).toMatchSnapshot();
  });
});
