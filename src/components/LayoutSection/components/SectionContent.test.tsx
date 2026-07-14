import { render } from "@testing-library/react";
import React from "react";
import SectionContent from "./SectionContent";

describe("SectionContent", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SectionContent />);
    expect(asFragment()).toMatchSnapshot();
  });
});
