import React from "react";
import { render } from "@testing-library/react";
import Info from "./Info";

describe("Info", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Info />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
