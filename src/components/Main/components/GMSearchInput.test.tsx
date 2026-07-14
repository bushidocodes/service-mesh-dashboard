import { render } from "@testing-library/react";
import React from "react";
import GMSearchInput from "./GMSearchInput";

describe("GMSearchInput", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<GMSearchInput />);
    expect(asFragment()).toMatchSnapshot();
  });
});
