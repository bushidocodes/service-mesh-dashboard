import { render } from "@testing-library/react";
import React from "react";
import TableHeader from "./TableHeader";

describe("TableHeader", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<TableHeader />);
    expect(asFragment()).toMatchSnapshot();
  });
});
