import { render } from "@testing-library/react";
import React from "react";
import BackgroundSquareRounded from "./BackgroundSquareRounded";

describe("BackgroundSquareRounded", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundSquareRounded />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
