import React from "react";
import { render } from "@testing-library/react";
import Power from "./Power";

describe("Power", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Power />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
