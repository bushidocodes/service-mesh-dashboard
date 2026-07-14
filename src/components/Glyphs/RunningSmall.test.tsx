import { render } from "@testing-library/react";
import React from "react";
import RunningSmall from "./RunningSmall";

describe("RunningSmall", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <RunningSmall />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
