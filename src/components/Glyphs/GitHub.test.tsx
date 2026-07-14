import { render } from "@testing-library/react";
import React from "react";
import GitHub from "./GitHub";

describe("GitHub", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <GitHub />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
