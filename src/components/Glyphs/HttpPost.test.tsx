import { render } from "@testing-library/react";
import React from "react";
import HttpPost from "./HttpPost";

describe("HttpPost", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <HttpPost />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
