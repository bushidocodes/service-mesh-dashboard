import { render } from "@testing-library/react";
import React from "react";
import BrandContainer from "./BrandContainer";

describe("BrandContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<BrandContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
