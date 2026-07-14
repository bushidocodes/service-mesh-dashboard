import { render } from "@testing-library/react";
import React from "react";
import MessageIconContainer from "./MessageIconContainer";

describe("MessageIconContainer", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<MessageIconContainer />);
    expect(asFragment()).toMatchSnapshot();
  });
});
