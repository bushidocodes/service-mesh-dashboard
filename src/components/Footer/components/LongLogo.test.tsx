import React from "react";
import { render } from "@testing-library/react";
import LongLogo from "./LongLogo";

describe("LongLogo", () => {
  it("should render", () => {
    const { asFragment } = render(<LongLogo />);
    expect(asFragment()).toMatchSnapshot();
  });
});
