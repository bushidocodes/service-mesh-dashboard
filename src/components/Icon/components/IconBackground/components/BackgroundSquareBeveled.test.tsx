import React from "react";
import { render } from "@testing-library/react";
import BackgroundSquareBeveled from "./BackgroundSquareBeveled";

describe("BackgroundSquareBeveled", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundSquareBeveled />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
