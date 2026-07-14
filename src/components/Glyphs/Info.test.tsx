import { render } from "@testing-library/react";
import React from "react";
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
