import { render } from "@testing-library/react";
import React from "react";
import SparklineCol from "./SparklineCol";

describe("SparklineCol", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SparklineCol />);
    expect(asFragment()).toMatchSnapshot();
  });
});
