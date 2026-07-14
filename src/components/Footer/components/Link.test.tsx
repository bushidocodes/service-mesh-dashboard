import { render } from "@testing-library/react";
import React from "react";
import Link from "./Link";

describe("Link", () => {
  it("should render", () => {
    const { asFragment } = render(<Link />);
    expect(asFragment()).toMatchSnapshot();
  });
});
