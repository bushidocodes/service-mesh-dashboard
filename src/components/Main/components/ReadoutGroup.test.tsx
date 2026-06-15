import React from "react";
import { render } from "@testing-library/react";
import ReadoutGroup from "./ReadoutGroup";

describe("ReadoutGroup", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutGroup />);
    expect(asFragment()).toMatchSnapshot();
  });
});
