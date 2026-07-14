import { render } from "@testing-library/react";
import React from "react";
import Memory from "./Memory";

describe("Memory", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Memory />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
