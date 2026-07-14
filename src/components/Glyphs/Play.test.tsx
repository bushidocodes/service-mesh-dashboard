import { render } from "@testing-library/react";
import React from "react";
import Play from "./Play";

describe("Play", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Play />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
