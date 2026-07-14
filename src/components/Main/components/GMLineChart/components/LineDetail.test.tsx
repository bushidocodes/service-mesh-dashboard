import { render } from "@testing-library/react";
import React from "react";
import LineDetail from "./LineDetail";

describe("LineDetail", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<LineDetail />);
    expect(asFragment()).toMatchSnapshot();
  });
});
