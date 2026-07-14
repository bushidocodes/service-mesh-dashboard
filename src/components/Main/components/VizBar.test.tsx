import { render } from "@testing-library/react";
import React from "react";
import VizBar from "./VizBar";

describe("VizBar", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<VizBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
