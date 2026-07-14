import { render } from "@testing-library/react";
import React from "react";
import ToolbarCenter from "./ToolbarCenter";

describe("ToolbarCenter", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ToolbarCenter />);
    expect(asFragment()).toMatchSnapshot();
  });
});
