import { render } from "@testing-library/react";
import React from "react";
import ReadoutItemDetail from "./ReadoutItemDetail";

describe("ReadoutItemDetail", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ReadoutItemDetail />);
    expect(asFragment()).toMatchSnapshot();
  });
});
