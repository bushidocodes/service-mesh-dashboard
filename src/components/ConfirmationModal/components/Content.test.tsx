import React from "react";
import { render } from "@testing-library/react";
import Content from "./Content";

describe("Content", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Content />);
    expect(asFragment()).toMatchSnapshot();
  });
});
