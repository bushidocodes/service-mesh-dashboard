import { render } from "@testing-library/react";
import React from "react";
import MetricsList from "./MetricsList";

describe("MetricsList", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<MetricsList />);
    expect(asFragment()).toMatchSnapshot();
  });
});
