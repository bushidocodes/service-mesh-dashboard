import React from "react";
import { render } from "@testing-library/react";
import ArrayValue from "./ArrayValue";

describe("ArrayValue", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ArrayValue />);
    expect(asFragment()).toMatchSnapshot();
  });
});
