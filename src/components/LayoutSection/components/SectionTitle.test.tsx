import { render } from "@testing-library/react";
import React from "react";
import SectionTitle from "./SectionTitle";

describe("SectionTitle", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<SectionTitle />);
    expect(asFragment()).toMatchSnapshot();
  });
});
