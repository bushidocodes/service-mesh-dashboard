import React from "react";
import { render } from "@testing-library/react";
import ServiceInstance from "./ServiceInstance";

describe("ServiceInstance", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(
      <svg>
        <ServiceInstance />
      </svg>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
