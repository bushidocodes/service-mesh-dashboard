import { render } from "@testing-library/react";
import React from "react";
import Header from "./Header";

describe("Header", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Header />);
    expect(asFragment()).toMatchSnapshot();
  });
});
