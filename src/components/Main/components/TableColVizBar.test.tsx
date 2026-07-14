import { render } from "@testing-library/react";
import React from "react";
import TableColVizBar from "./TableColVizBar";

describe("TableColVizBar", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableColVizBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
