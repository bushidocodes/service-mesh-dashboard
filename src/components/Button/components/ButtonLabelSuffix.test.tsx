import { render } from "@testing-library/react";
import React from "react";
import ButtonLabelSuffix from "./ButtonLabelSuffix";

describe("ButtonLabelSuffix", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ButtonLabelSuffix />);
    expect(asFragment()).toMatchSnapshot();
  });
});
