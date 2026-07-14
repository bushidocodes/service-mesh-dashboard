import { render } from "@testing-library/react";
import React from "react";
import Service from "./Service";

describe("Service", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <Service />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
