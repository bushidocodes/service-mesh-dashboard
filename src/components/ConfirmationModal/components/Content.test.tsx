import { render } from "@testing-library/react";
import React from "react";
import Content from "./Content";

describe("Content", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Content />);
    expect(asFragment()).toMatchSnapshot();
  });
});
