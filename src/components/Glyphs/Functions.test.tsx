import React from "react";
import { render } from "@testing-library/react";
import Functions from "./Functions";

describe("Functions", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Functions />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
