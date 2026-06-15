import React from "react";
import { render } from "@testing-library/react";
import VizBar from "./VizBar";

describe("VizBar", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<VizBar />);
    expect(asFragment()).toMatchSnapshot();
  });
});
