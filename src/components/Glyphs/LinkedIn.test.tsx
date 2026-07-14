import { render } from "@testing-library/react";
import React from "react";
import LinkedIn from "./LinkedIn";

describe("LinkedIn", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <LinkedIn />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
