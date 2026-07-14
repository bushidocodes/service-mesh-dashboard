import { render } from "@testing-library/react";
import React from "react";
import SectionIcon from "./SectionIcon";

describe("SectionIcon", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SectionIcon />);
    expect(asFragment()).toMatchSnapshot();
  });
});
