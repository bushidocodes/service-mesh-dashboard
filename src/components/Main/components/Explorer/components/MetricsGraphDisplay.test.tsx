import React from "react";
import { render } from "@testing-library/react";
import MetricsGraphDisplay from "./MetricsGraphDisplay";

describe("MetricsGraphDisplay", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<MetricsGraphDisplay />);
    expect(asFragment()).toMatchSnapshot();
  });
});
