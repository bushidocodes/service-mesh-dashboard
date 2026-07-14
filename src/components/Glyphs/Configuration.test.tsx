import { render } from "@testing-library/react";
import React from "react";
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
