import { render } from "@testing-library/react";
import React from "react";
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
