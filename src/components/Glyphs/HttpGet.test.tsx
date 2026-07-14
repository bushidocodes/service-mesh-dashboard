import { render } from "@testing-library/react";
import React from "react";
import HttpGet from "./HttpGet";

describe("HttpGet", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <HttpGet />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
