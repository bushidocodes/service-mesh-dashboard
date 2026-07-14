import { render } from "@testing-library/react";
import React from "react";
import DataTitle from "./DataTitle";

describe("DataTitle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<DataTitle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
