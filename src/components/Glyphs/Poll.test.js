import React from "react";
import { render } from "@testing-library/react";
import Poll from "./Poll";

describe("Poll", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Poll />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
