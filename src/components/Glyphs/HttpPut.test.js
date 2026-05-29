import React from "react";
import { render } from "@testing-library/react";
import HttpPut from "./HttpPut";

describe("HttpPut", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <HttpPut />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
