import { render } from "@testing-library/react";
import React from "react";
import ReadoutItemTitle from "./ReadoutItemTitle";

describe("ReadoutItemTitle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutItemTitle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
