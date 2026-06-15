import React from "react";
import { render } from "@testing-library/react";
import BackgroundSquareSmall from "./BackgroundSquareSmall";

describe("BackgroundSquareSmall", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundSquareSmall />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
