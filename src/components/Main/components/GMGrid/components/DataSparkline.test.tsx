import React from "react";
import { render } from "@testing-library/react";
import DataSparkline from "./DataSparkline";

describe("DataSparkline", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DataSparkline />);
    expect(asFragment()).toMatchSnapshot();
  });
});
