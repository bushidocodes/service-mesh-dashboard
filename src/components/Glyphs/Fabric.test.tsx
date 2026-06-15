import React from "react";
import { render } from "@testing-library/react";
import Fabric from "./Fabric";

describe("Fabric", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Fabric />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
