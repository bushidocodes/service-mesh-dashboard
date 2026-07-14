import { render } from "@testing-library/react";
import React from "react";
import BackgroundSquircle from "./BackgroundSquircle";

describe("BackgroundSquircle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BackgroundSquircle />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
