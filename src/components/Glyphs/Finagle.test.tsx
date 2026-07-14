import { render } from "@testing-library/react";
import React from "react";
import Finagle from "./Finagle";

describe("Finagle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Finagle />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
