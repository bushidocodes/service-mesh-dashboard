import React from "react";
import { render } from "@testing-library/react";
import BorderCircleSmall from "./BorderCircleSmall";

describe("BorderCircleSmall", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BorderCircleSmall />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
