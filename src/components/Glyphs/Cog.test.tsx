import { render } from "@testing-library/react";
import React from "react";
import Cog from "./Cog";

describe("Cog", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Cog />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
