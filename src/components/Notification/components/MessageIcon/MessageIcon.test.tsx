import { render } from "@testing-library/react";
import React from "react";
import MessageIcon from "./MessageIcon";

describe("MessageIcon", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<MessageIcon />);
    expect(asFragment()).toMatchSnapshot();
  });
});
