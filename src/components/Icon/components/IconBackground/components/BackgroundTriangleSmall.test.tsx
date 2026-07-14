import { render } from "@testing-library/react";
import React from "react";
import BackgroundTriangleSmall from "./BackgroundTriangleSmall";

describe("BackgroundTriangleSmall", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundTriangleSmall />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
