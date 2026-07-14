import { render } from "@testing-library/react";
import React from "react";
import Bars from "./Bars";

describe("Bars", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Bars />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
