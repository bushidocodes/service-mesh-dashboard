import { render } from "@testing-library/react";
import React from "react";
import Message from "./Message";

describe("Message", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<Message />);
    expect(asFragment()).toMatchSnapshot();
  });
});
