import React from "react";
import { render } from "@testing-library/react";
import Explorer from "./Explorer";

describe("Explorer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Explorer />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
