import { render } from "@testing-library/react";
import React from "react";
import Badge from "./Badge";

describe("Badge", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Badge />);
    expect(asFragment()).toMatchSnapshot();
  });
});
