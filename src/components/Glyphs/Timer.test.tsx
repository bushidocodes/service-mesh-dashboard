import { render } from "@testing-library/react";
import React from "react";
import Timer from "./Timer";

describe("Timer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Timer />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
