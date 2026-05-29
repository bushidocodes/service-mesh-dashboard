import React from "react";
import { render } from "@testing-library/react";
import Scatterplot from "./Scatterplot";

describe("Scatterplot", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Scatterplot />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
