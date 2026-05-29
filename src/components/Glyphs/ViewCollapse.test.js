import React from "react";
import { render } from "@testing-library/react";
import ViewCollapse from "./ViewCollapse";

describe("ViewCollapse", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <ViewCollapse />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
