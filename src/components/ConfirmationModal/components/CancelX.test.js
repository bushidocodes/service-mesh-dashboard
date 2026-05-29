import React from "react";
import { render } from "@testing-library/react";
import CancelX from "./CancelX";

describe("CancelX", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<CancelX />);
    expect(asFragment()).toMatchSnapshot();
  });
});
