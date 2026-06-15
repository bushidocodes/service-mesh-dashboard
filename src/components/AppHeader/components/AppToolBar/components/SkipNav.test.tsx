import React from "react";
import { render } from "@testing-library/react";
import SkipNav from "./SkipNav";

describe("SkipNav", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SkipNav />);
    expect(asFragment()).toMatchSnapshot();
  });
});
