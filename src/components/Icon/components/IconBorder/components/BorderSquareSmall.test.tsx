import { render } from "@testing-library/react";
import React from "react";
import BorderSquareSmall from "./BorderSquareSmall";

describe("BorderSquareSmall", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <BorderSquareSmall />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
