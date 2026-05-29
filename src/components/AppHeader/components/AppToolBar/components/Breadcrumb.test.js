import React from "react";
import { render } from "@testing-library/react";
import Breadcrumb from "./Breadcrumb";

describe("Breadcrumb", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Breadcrumb />);
    expect(asFragment()).toMatchSnapshot();
  });
});
