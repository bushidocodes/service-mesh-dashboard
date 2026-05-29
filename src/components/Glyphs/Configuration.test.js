import React from "react";
import { render } from "@testing-library/react";
import Configuration from "./Configuration";

describe("Configuration", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Configuration />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
