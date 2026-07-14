import { render } from "@testing-library/react";
import React from "react";
import NoKey from "./NoKey";

describe("NoKey", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <NoKey />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
