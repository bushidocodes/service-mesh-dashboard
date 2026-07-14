import { render } from "@testing-library/react";
import React from "react";
import ToolbarRight from "./ToolbarRight";

describe("ToolbarRight", () => {
  it("matches snapshot", () => {
    const { asFragment } = render(<ToolbarRight />);
    expect(asFragment()).toMatchSnapshot();
  });
});
