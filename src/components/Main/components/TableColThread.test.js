import React from "react";
import { render } from "@testing-library/react";
import TableColThread from "./TableColThread";

describe("TableColThread", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableColThread />);
    expect(asFragment()).toMatchSnapshot();
  });
});
