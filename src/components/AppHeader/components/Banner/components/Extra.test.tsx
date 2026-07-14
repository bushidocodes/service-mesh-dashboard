import { render } from "@testing-library/react";
import React from "react";
import Extra from "./Extra";

describe("Extra", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Extra />);
    expect(asFragment()).toMatchSnapshot();
  });
});
