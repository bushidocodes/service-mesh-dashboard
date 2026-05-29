import React from "react";
import { render } from "@testing-library/react";
import BrandText from "./BrandText";

describe("BrandText", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<BrandText />);
    expect(asFragment()).toMatchSnapshot();
  });
});
