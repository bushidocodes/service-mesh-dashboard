import { render } from "@testing-library/react";
import React from "react";
import CPU from "./CPU";

describe("CPU", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <CPU />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
