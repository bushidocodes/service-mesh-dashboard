import { render } from "@testing-library/react";
import React from "react";
import NotFound from "./NotFound";

describe("NotFound", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<NotFound />);
    expect(asFragment()).toMatchSnapshot();
  });
});
