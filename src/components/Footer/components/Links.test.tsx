import React from "react";
import { render } from "@testing-library/react";
import Links from "./Links";

describe("Link", () => {
  it("should render", () => {
    const { asFragment } = render(<Links />);
    expect(asFragment()).toMatchSnapshot();
  });
});
