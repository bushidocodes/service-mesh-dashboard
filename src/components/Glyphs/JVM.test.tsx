import { render } from "@testing-library/react";
import React from "react";
import JVM from "./JVM";

describe("JVM", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <JVM />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
