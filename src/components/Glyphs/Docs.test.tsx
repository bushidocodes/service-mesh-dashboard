import { render } from "@testing-library/react";
import React from "react";
import Docs from "./Docs";

describe("Docs", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Docs />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
