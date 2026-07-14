import { render } from "@testing-library/react";
import React from "react";
import Rows from "./Rows";

describe("Rows", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Rows />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
