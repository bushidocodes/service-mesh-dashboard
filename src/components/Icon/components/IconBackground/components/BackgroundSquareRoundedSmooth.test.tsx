import React from "react";
import { render } from "@testing-library/react";
import BackgroundSquareRoundedSmooth from "./BackgroundSquareRoundedSmooth";

describe("BackgroundSquareRoundedSmooth", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundSquareRoundedSmooth />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
