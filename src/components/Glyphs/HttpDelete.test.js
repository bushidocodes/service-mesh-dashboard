import React from "react";
import { render } from "@testing-library/react";
import HttpDelete from "./HttpDelete";

describe("HttpDelete", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <HttpDelete />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
