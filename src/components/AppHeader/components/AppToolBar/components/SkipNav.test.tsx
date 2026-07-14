import { render } from "@testing-library/react";
import React from "react";
import SkipNav from "./SkipNav";

describe("SkipNav", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SkipNav />);
    expect(asFragment()).toMatchSnapshot();
  });
});
