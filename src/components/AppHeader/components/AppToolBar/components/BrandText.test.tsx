import { render } from "@testing-library/react";
import React from "react";
import BrandText from "./BrandText";

describe("BrandText", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<BrandText />);
    expect(asFragment()).toMatchSnapshot();
  });
});
