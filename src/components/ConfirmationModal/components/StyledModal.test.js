import React from "react";
import { render } from "@testing-library/react";
import StyledModal from "./StyledModal";

describe("StyledModal", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<StyledModal isOpen={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
