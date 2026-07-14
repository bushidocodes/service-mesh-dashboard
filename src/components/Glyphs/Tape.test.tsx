import { render } from "@testing-library/react";
import React from "react";
import Tape from "./Tape";

describe("Tape", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Tape />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
