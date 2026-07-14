import { render } from "@testing-library/react";
import React from "react";
import StyledModal from "./StyledModal";

describe("StyledModal", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<StyledModal isOpen={false} />);
    expect(asFragment()).toMatchSnapshot();
  });
});
