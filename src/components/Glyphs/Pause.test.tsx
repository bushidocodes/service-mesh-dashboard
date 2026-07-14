import { render } from "@testing-library/react";
import React from "react";
import Pause from "./Pause";

describe("Pause", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Pause />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
