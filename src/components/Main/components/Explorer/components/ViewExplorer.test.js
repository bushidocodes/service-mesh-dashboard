import React from "react";
import { render } from "@testing-library/react";
import ViewExplorer from "./ViewExplorer";

describe("ViewExplorer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ViewExplorer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
