import React from "react";
import { render } from "@testing-library/react";
import Negation from "./Negation";

describe("Negation", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Negation />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
