import { render } from "@testing-library/react";
import React from "react";
import ToolbarLeft from "./ToolbarLeft";

describe("ToolbarLeft", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ToolbarLeft />);
    expect(asFragment()).toMatchSnapshot();
  });
});
