import { render } from "@testing-library/react";
import React from "react";
import MetricsGraphDisplay from "./MetricsGraphDisplay";

describe("MetricsGraphDisplay", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<MetricsGraphDisplay />);
    expect(asFragment()).toMatchSnapshot();
  });
});
