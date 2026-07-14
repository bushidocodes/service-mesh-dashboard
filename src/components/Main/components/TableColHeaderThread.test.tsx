import { render } from "@testing-library/react";
import React from "react";
import TableColHeaderThread from "./TableColHeaderThread";

describe("TableColHeaderThread", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableColHeaderThread />);
    expect(asFragment()).toMatchSnapshot();
  });
});
